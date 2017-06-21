## DIA web portal

A single page application that queries against a json file full of business requirements.

### To get started
This project is templated using [moustache](https://mustache.github.io/) bundled using [webpack](https://webpack.github.io/).


1. `npm install`
2. `npm run build`
  - this will run a webpack server that imports assets from the `src` file and bundles them together into `dist/bundle.js`

### Production
- `npm start` 
 - this runs our stock express server which grabs compiled assets from the `dist` folder


then check out `localhost:8080`