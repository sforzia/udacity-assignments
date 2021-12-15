# Project Introduction

A project to show the how APIs work behind the scene, how multiple APIs are called to show a meaningful, summarized response to the user. The user is provided with two simple inputs, text and date to book a trip. Rest of the logic works behind the scene and user is shown the response accordingly.

In this project we have used three different APIs, the `geonames` api to fetch the latitude and longitude of a given location, the `pixibay` api to search for popular images related to a given location, and the `weatherbit` api to get the current weather or forcast results.

## Getting started

All dependencies for this project to run are already present in the `package.json` file. For this project to run properly you'll have to provide the api keys to fetch data from their respective servers, refer [here](#setup-api-keys). Once you clone this repo, you will have to install everything:

`cd` into your new folder and run:

- `npm install`

and then run the express server by running `npm start`, the server is configured to run on port number `8081`.

- `npm run build-dev` command will be used to run the webpack dev server, which will automatically reflect the changes once saved.
- `npm run build-prod` command will be used to create an optimised build for production use.

### Setup API keys

Next we need to include our API keys for this project to run:

- [ ] Use npm or yarn to install the dotenv package `npm install dotenv`. This will allow us to use environment variables we set in a new file
- [ ] Create a new `.env` file in the root of your project
- [ ] Go to your .gitignore file and add `.env` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:

```
GEONAMES_USERNAME=********************************
PIXABAY_API_KEY=**********************************
WEATHERBIT_API_KEY=*******************************
```

## Deploying

A great step to take with your finished project would be to deploy it! Checkout [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/) for some really intuitive free hosting options.
