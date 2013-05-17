var express = require("express");
var words = require("./words");

var app = express();

var PORT = 8888;

app.get("/words", function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    words.getWords(req, res, function(words) {
        res.json(words);
    });
});

app.listen(process.env.PORT || PORT);
console.log("Listening on port " + PORT + "...");
