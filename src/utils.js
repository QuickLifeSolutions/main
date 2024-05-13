
const Apify = require('apify');
const { log } = Apify.utils;

const COUNTRY_DICT = require('./constants').COUNTRY_DICT;

const makeUrlFull = (href, urlParsed) => {
    if (href.startsWith('/')) {
        return urlParsed.origin + href;
    }
    return href;
};

const getIdFromUrl = (url) => {
    const match = url.match(/(?<=jk=)[^&]+/);
    return match ? match[0] : '';
};

const fromStartUrls = async function* (startUrls, name = 'STARTURLS') {
    const requestList = await Apify.openRequestList(name, startUrls);
    let request;
    while (request = await requestList.fetchNextRequest()) {
        yield request;
    }
};

const checkMaxItemsInput = (maxItems) => {
    if (maxItems > 990) {
        log.warning('The limit of items you set exceeds the maximum allowed value of 990.');
        return 990;
    }
    return maxItems || 990;
};

const buildStartUrl = async ({ requestQueue, position, location, country, startUrls, currentPageNumber }) => {
    if (startUrls && startUrls.length > 0) {
        for await (const request of fromStartUrls(startUrls)) {
            request.userData = { label: request.userData.label || 'START', currentPageNumber };
            request.url += '&sort=date';
            await requestQueue.addRequest(request);
        }
    } else {
        const baseUrl = COUNTRY_DICT[country.toLowerCase()] || `https://${country}.indeed.com`;
        const queryParams = [];
        if (position) queryParams.push(`q=${encodeURIComponent(position)}`);
        if (location) queryParams.push(`l=${encodeURIComponent(location)}`);
        queryParams.push('sort=date');

        const startUrl = `${baseUrl}/jobs?${queryParams.join('&')}`;
        await requestQueue.addRequest({
            url: startUrl,
            userData: { label: 'START', currentPageNumber },
        });
    }
};

module.exports = {
    makeUrlFull,
    getIdFromUrl,
    fromStartUrls,
    checkMaxItemsInput,
    buildStartUrl,
};
