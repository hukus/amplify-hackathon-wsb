var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const fetch = require("node-fetch");

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
      const data = json.data.children.map((c) => c.data.title);
      res.json({
        success: "get call succeed!",
        url: res.url,
        data: data,
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
