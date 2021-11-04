# Project Introduction

Natural Language Processing leverage machine learning and deep learning create a program that can interpret natural human speech. Systems like Alexa, Google Assistant, and many voice interaction programs are well known to us, but understanding human speech is an incredibly difficult task and requires a lot of resources to achieve. Full disclosure, this is the Wikipedia definition, but I found it to be a clear one:

> Natural language processing (NLP) is a subfield of computer science, information engineering, and artificial intelligence
> concerned with the interactions between computers and human (natural) languages, in particular how to program computers to
> process and analyze large amounts of natural language data.

In this project we have used the `MeaningCloud's` text classification API. The definition of `text classification` as per `MeaningCloud's` documentation is:

> Text Classification assigns one or more classes to a document according to their content. Classes are selected from a
> previously established taxonomy (a hierarchy of catergories or classes). The Text Classification API takes care of all
> preprocessing tasks (extracting text, tokenization, stopword removal and lemmatization) required for automatic classification.

## Getting started

All dependencies for this project to run are already present in the `package.json` file. For this project to run properly you'll have to provide a `MeaningCloud` API key, Refer (this)[#setup_meaningcloud_api_key]. Once you clone this repo, you will have to install everything:

`cd` into your new folder and run:

- `npm install`

### Setup MeaningCloud API key:

Next we need to include our API keys for this project to run:

- [ ] Use npm or yarn to install the dotenv package `npm install dotenv`. This will allow us to use environment variables we set in a new file
- [ ] Create a new `.env` file in the root of your project
- [ ] Go to your .gitignore file and add `.env` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:

```
API_KEY=**************************
```

## Deploying

A great step to take with your finished project would be to deploy it! Checkout [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/) for some really intuitive free hosting options.
