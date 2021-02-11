var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const fetch = require("node-fetch");
const wf = require("word-freq");
const splitToWords = require("split-to-words");

const tickers = require("./tickers").tickers;

// parse by tokenization?
// var str =
//   "@someone tweeted about $FOMO houses: housing is the most expensive thing ever f#!*";
// var freq = wf.freq(str, true, false);
// console.log(freq);
// console.log(splitToWords(str));

function hasNumber(myString) {
  return /\d/.test(myString);
}

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/wsb", function (_req, res) {
  fetch(
    "https://www.reddit.com/r/wallstreetbets/search.json?sort=top&q=flair%3ADD&restrict_sr=on&t=week"
  )
    .then((response) => response.json())
    .then((json) => {
      const posts = json.data.children.map((c) => c.data.selftext);
      const allText = posts.join();
      const words = splitToWords(allText);
      const stocks = words.filter((w) => {
        const word = w.toUpperCase();
        return Boolean(tickers[word]);
      });
      const stocksJoined = stocks.join();
      const freq = wf.freq(stocksJoined, true, false);
      const sortedFreq = Object.fromEntries(
        Object.entries(freq).sort(([, a], [, b]) => b - a)
      );

      const result = Object.keys(sortedFreq).map((key) => {
        const KEY = String(key).toUpperCase();
        return {
          ticker: KEY,
          stock: tickers[KEY] || "ETF or unkown",
          mentions: freq[key],
        };
      });
      res.json({
        success: "get call succeed!",
        url: res.url,
        data: result,
      });
    })
    .catch((error) => res.json({ error: error }));
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
