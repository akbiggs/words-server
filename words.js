var sys = require("sys");
var exec = require("child_process").exec;
var child;

var validInput = /[A-Za-z]+/;

var getWords = function(req, res, callback) {
    var err;
    if (err = isInvalid(req)) {
        callback({error: err});
    }
    
    var rof = req.query.rof;
    var rwith = req.query.rwith;
    var rwhere = req.query.rwhere;

    statement = makeStatement(rof, rwith, rwhere);
    child = exec(statement, function(error, stdout, stderr) {
        if (error != null) {
            console.log("ERROR: " + error);
            return;
        }

        callback(stdout.split("\n"));
    });
};

var makeStatement = function(rof, rwith, rwhere) {
    if (!rof && !rwith) {
        return "cat /usr/share/dict/words";
    } else {
        return "grep " + selectOccurences(rof, rwhere) + " /usr/share/dict/words" +
            "| sed s/" + rof + "/" + rwith + "/g";
    }
};

var selectOccurences = function(word, where) {
    if (where === "beginning") {
        return "^" + word;
    } else if (where === "end") {
        return word + "$";
    }

    return word;
};

var isInvalid = function(req) {
    if (req.query.rof && !req.query.rwith ||
        req.query.rwith && !req.query.rof)
        return "Need to specify both phrase to replace and phrase to replace with.";
    else {
        if (!validInput.test(req.query.rof)) {
            return "Invalid phrase to replace. Phrase should only include letters.";
        }

        if (!validInput.test(req.query.rwith)) {
            return "Invalid phrase to replace with. Phrase should only include letters.";
        }
    }
}
exports.getWords = getWords;
