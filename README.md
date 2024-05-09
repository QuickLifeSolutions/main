
```markdown
# Indeed Scraper

## Overview

Indeed Scraper is a powerful tool on the [Apify platform](https://apify.com) designed to extract job posting data from [Indeed.com](https://www.indeed.com/). Using the [Apify SDK](https://sdk.apify.com/), this scraper gathers detailed information about job listings across different regions and job types.

## Features

- Scrape job listings from specific countries, cities, or regions.
- Extract detailed information including job title, company, location, and salary.
- Flexible input parameters to tailor the search to specific needs.

## Input

Customize the scraper with input parameters like country, job title, and location:

```json
{
  "country": "us",
  "position": "software engineer",
  "location": "new york",
  "startUrls": [{"url": "https://www.indeed.com/jobs?q=software+engineer&l=new+york"}],
  "maxItems": 50,
  "proxyConfiguration": { "useApifyProxy": true }
}
```

## Output

Output data is stored in Apify's dataset, with each item providing detailed job information:

```json
{
  "positionName": "Senior Software Engineer",
  "company": "Tech Company",
  "location": "New York, NY",
  "salary": "From $100,000 a year",
  "url": "https://www.indeed.com/viewjob?jk=example123",
  "description": "Join our team of developers..."
}
```

## Connect With Us

- **YouTube**: [Visit our channel](https://www.youtube.com/channel/UCSglWXooehH8Cy7LYHhXtqA)
- **Instagram**: [Follow us on Instagram](https://www.instagram.com/quicklifesolutionsofficial/)
- **Newsletter**: [Subscribe to our newsletter](https://sendfox.com/quicklifesolutions)
- **Free Consultation**: [Book a free consultation](https://tidycal.com/quicklifesolutions)
- **More Tools**: [Explore our Apify actors](https://apify.com/dainty_screw)

### Support

- **Discord**: [Get support here](https://discord.gg/2WGj2PDmHb)
- **Email**: [Email us](mailto:codemasterdevops@gmail.com)
```

