const Apify = require('apify');
const { makeUrlFull, getIdFromUrl, checkMaxItemsInput, buildStartUrl } = require('./utils');
const { log } = Apify.utils;

Apify.main(async () => {
    const input = await Apify.getInput() || {};
    const {
        country,
        maxConcurrency,
        position,
        location,
        startUrls,
        extendOutputFunction,
        proxyConfiguration = {
            useApifyProxy: true
        },
        saveOnlyUniqueItems = true,
    } = input;

    let maxItems = checkMaxItemsInput(input.maxItems || 990);
    let itemsCounter = 0;
    let currentPageNumber = 1;

    let extendOutputFunctionValid;
    if (extendOutputFunction) {
        try {
            extendOutputFunctionValid = eval(`(${extendOutputFunction})`);
        } catch (e) {
            throw new Error(`extendOutputFunction is not valid JavaScript! Error: ${e}`);
        }
    }

    const requestQueue = await Apify.openRequestQueue();
    await buildStartUrl({ requestQueue, position, location, country, startUrls, currentPageNumber });

    const sdkProxyConfiguration = await Apify.createProxyConfiguration(proxyConfiguration);
    if (Apify.getEnv().isAtHome && !sdkProxyConfiguration) {
        throw new Error('You must use Apify Proxy or custom proxies to run this scraper on the platform!');
    }

    log.info('Starting crawler...');
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 50,
            sessionOptions: {
                maxUsageCount: 50,
            },
        },
        maxConcurrency,
        maxRequestRetries: 10, // Handling 403s by allowing retries
        proxyConfiguration: sdkProxyConfiguration,
        handlePageFunction: async ({ $, request, session, response }) => {
            log.info(`Processing ${request.userData.label} page at URL: ${request.url}`);
            if (![200, 404].includes(response.statusCode)) {
                session.retire();
                throw new Error(`Blocked or failed request at ${request.url}, status code: ${response.statusCode}`);
            }

            if (request.userData.label === 'START' || request.userData.label === 'LIST') {
                const noResultsFlag = $('.no_results').length > 0;
                if (noResultsFlag) {
                    log.info('No results found at URL: ' + request.url);
                    return;
                }

                const detailLinks = $('.tapItem a[data-jk]').map((index, element) => {
                    const href = $(element).attr('href');
                    return {
                        url: makeUrlFull(href, new URL(request.url)),
                        uniqueKey: $(element).attr('data-jk'),
                        userData: { label: 'DETAIL' }
                    };
                }).get();

                await Promise.all(detailLinks.map(link => requestQueue.addRequest(link)));
            } else if (request.userData.label === 'DETAIL') {
                if (response.statusCode === 404) {
                    log.warning('Job offer no longer available: ' + request.url);
                    return;
                }

                let result = extendOutputFunctionValid ? await extendOutputFunctionValid($) : {
                    positionName: $('.jobsearch-JobInfoHeader-title').text().trim(),
                    company: $('div.icl-u-lg-mr--sm.icl-u-xs-mr--xs').text().trim(),
                    location: $('div.jobsearch-InlineCompanyRating div.icl-u-xs-mt--xs').last().text().trim(),
                    postedAt: $('.jobsearch-JobMetadataFooter').text().trim(),
                    description: $('#jobDescriptionText').text().trim(),
                    url: request.url
                };

                await Apify.pushData(result);
            }
        },
        handleFailedRequestFunction: async ({ request }) => {
            log.error(`Request ${request.url} failed too many times and will not be retried.`);
        },
    });

    await crawler.run();
    log.info('Crawler has finished.');
});
