const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  from: { type: String, required: true },
  body: { type: String },
  image: { type: String },
  createdAt: { type: String },
});

module.exports = mongoose.model("Post", PostSchema);
