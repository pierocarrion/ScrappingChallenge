# Scrapping Challenge
Chrome extension that allows the scraping of Linkedin accounts according to an Input (keyword). NodeJS was used for its creation
[![NodeJS]]

### Requirement 
 1. Chromium Browser
 2. LinkedIn Account with a large network

### Change keyword
In src/scripts/scrapCandidates.js - Line 52
```sh
const keywordToLookFor = 'full stack'
```

### Deployment
```sh
yarn db-json npm run db-json
```
Or
```sh
npm run db-json
```
