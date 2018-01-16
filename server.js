// server.js
// where your node app starts

// init project
var mongoose = require("mongoose");
var express = require('express');
var app = express();
var Urls = require("./models/urls");
var path = require("path");

app.set("views", path.resolve(__dirname, "view"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://vd1:vd1-password@ds157057.mlab.com:57057/shortify");

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/new/:newUrl(*)", function(req, res, next) {
  var newUrl = req.params.newUrl;
  console.log("Got new URL request: " + newUrl);
  
  var urlRegEx = /(http|https)\:\/\/www\.\w+\.\w+/;
  
  if (urlRegEx.test(newUrl)) {
    Urls.count({}, function(err , count){
      console.log("Current url count="+count);
      
      Urls.findOne({original: newUrl}, function(err, data) {
        if(err) { return next(err); }
        if(data) {
          console.log("Found matching URL. Returning shortened="+data.shortened);
          var shortenedUrl = data.shortened;
          res.send("Your shortened url is: "+shortenedUrl);
        }
        else {
          console.log("No matching URL. Making new shortened one. number="+count);
          var shortenedUrl = "https://vd1-shortify.glitch.me/"+count;
          var newData = new Urls({
            original: newUrl,
            shortened: shortenedUrl
          });
          newData.save(next);
          res.send("Your shortened url is: "+shortenedUrl);
        }
      });
    });
  }
  else {
    res.send(newUrl + " does not appear to be a valid URL. Please use format http://www.example.com");
  }
  
});

app.get(/\/(\d+)/, function(req, res, next) {
  var num = req.params[0];
  var shortenedUrl = "https://vd1-shortify.glitch.me/"+num;
  
  Urls.findOne({shortened: shortenedUrl}, function(err, data) {
    if(err) { return next(err); }
    if(data) {
      console.log("Found matching short URL. Returning original="+data.original);
      var originalUrl = data.original;
      res.redirect(originalUrl);
    }
    else {
      res.send("Redirect number "+num+" not found in database.");
    }
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
