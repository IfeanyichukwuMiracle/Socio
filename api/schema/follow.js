const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  follower: { type: String },
  followed: { type: String },
});

module.exports = mongoose.model("Follow", FollowSchema);
