const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  body: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: String },
});

module.exports = mongoose.model("Comment", CommentSchema);
