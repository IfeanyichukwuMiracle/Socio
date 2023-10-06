const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Imports
const UsersRoute = require("./routes/user");
const PostsRoute = require("./routes/post");
const FollowRoute = require("./routes/follow");
const CommentRoute = require("./routes/comment");

// middleware routes
app.use("/users", UsersRoute);
app.use("/posts", PostsRoute);
app.use("/follow", FollowRoute);
app.use("/comment", CommentRoute);

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "Hey!" });
});
app.all("*", (req, res) => {
  return res.status(400).json({ msg: "No route!" });
});

//
//
// Connect to database && listen on port 5002
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CLOUD_URI);
    console.log(`Connected`);

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started`));
  } catch (error) {
    console.log(error);
  }
};

start();
