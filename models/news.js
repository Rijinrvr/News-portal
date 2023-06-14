const mongoose = require("mongoose");

let newsSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },
  vediourl: {
    type: String,
    required: true,
  },
});
let News = mongoose.model("News", newsSchema);
module.exports = { News, newsSchema };
