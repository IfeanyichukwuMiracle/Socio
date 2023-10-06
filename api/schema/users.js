const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImg: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
