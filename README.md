Here's the revised README.md for your Indeed Scraper:

```markdown
# Indeed Scraper

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Input](#input)
- [Output](#output)
- [Compute Units Consumption](#compute-units-consumption)
- [Extend Output Function](#extend-output-function)
- [Changelog](#changelog)

## Overview

Indeed Scraper is an [Apify actor](https://apify.com/actors) designed for extracting job posting information from [Indeed.com](https://www.indeed.com/). Built on top of the [Apify SDK](https://sdk.apify.com/), it can be run both on the [Apify platform](https://my.apify.com) and locally to gather data across various regions and job types.

## Features

- **Flexible Location Searches:** Customize searches by country, city, or region.
- **Comprehensive Data Extraction:** Pull detailed information about job positions including company name, location, salary, and more.
- **Scalable:** Designed to handle everything from small to large-scale scraping tasks.

## Input

Configure the scraper with the following input parameters:

| Field               | Type    | Description                                                                                     | Default Value                                                            |
|---------------------|---------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| country             | string  | Country code for location-specific searches, e.g., 'us' for United States or 'uk' for United Kingdom | none                                                                     |
| position            | string  | Search term for job titles or company names                                                     | none                                                                     |
| location            | string  | City or area to narrow down job listings                                                        | none                                                                     |
| startUrls           | array   | Initial URLs for deep crawling, supports category/search URLs or detail URLs                    | `[{"url": "https://www.indeed.com/jobs?q=software+engineer&l=san+francisco"}]` |
| maxItems            | number  | Maximum number of pages to scrape                                                               | all found                                                                |
| extendOutputFunction| string  | Custom function for extracting additional details                                               |                                                                          |
| proxyConfiguration  | object  | Proxy settings for the scraper; required for operation.                                         | `{ "useApifyProxy": true }`                                              |

### Example Input
```json
{
  "country": "us",
  "position": "data scientist",
  "location": "new york",
  "startUrls": [{"url": "https://www.indeed.com/jobs?q=data+scientist&l=new+york"}],
  "maxItems": 50,
  "extendOutputFunction": "($) => { return { jobType: $(\".jobType\").text().trim() }; }",
  "proxyConfiguration": { "useApifyProxy": true }
}
```

## Output

Data is saved in a structured format in the dataset. Each record includes comprehensive job details:

```json
{
  "positionName": "Senior Data Scientist",
  "company": "Tech Innovations Inc.",
  "location": "New York, NY",
  "salary": "From $120,000 a year",
  "postedAt": "1 day ago",
  "url": "https://www.indeed.com/viewjob?jk=abcd1234",
  "description": "As a Senior Data Scientist, you will be responsible for..."
}
```

## Compute Units Consumption

The scraper is optimized for efficiency, consuming approximately **1 compute unit for every 1000 actor pages** scraped. This makes it suitable for both short-term and extensive scraping tasks.

## Extend Output Function

Customize the output by implementing a JavaScript function that modifies the default data extraction:

```javascript
($) => {
  return {
    jobType: $("span[class='jobsearch-JobMetadataHeader-iconLabel']").eq(1).text().trim(),
    url: undefined  // Example to remove a field
  };
}
```

## Changelog

Please refer to [CHANGELOG.md](https://github.com/metalwarrior665/actor-indeed-scraper/blob/master/CHANGELOG.md) for recent updates and new feature additions.

## Connect With Us

- **YouTube**: [Visit our channel](https://www.youtube.com/channel/UCSglWXooehH8Cy7LYHhXtqA)
- **Instagram**: [Follow us on Instagram](https://www.instagram.com/quicklifesolutionsofficial/)
- **AI Newsletter**: [Subscribe to our newsletter](https://sendfox.com/quicklifesolutions)
- **Free Consultation**: [Book a free consultation call](https://tidycal.com/quicklifesolutions/free-consultation)
- **More Tools**: [Explore our Apify actors](https://apify.com/dainty_screw)

### Support

- **Discord**: [Raise a Support ticket here](https://discord.gg/2

WGj2PDmHb)
- **Email**: [Contact us](mailto:codemasterdevops@gmail.com)
```
