var mongoose = require("mongoose");

var urlSchema = mongoose.Schema({
  original: {type: String, required: true, unique: true},
  shortened: {type: String, required: true}
});

var Urls = mongoose.model("Urls", urlSchema);
module.exports = Urls;