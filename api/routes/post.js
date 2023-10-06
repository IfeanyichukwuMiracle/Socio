const express = require("express");
const router = express.Router();
const { upload, cloudinary } = require("../controllers/upload");
const auth = require("../middleware/auth");
const Post = require("../schema/posts");

//
// Get all posts
router.get("/", auth, async (req, res) => {
  try {
    if (req.user) {
      const posts = await Post.find();
      if (posts.length !== 0) {
        return res.status(200).json(posts);
      }
      return res.status(200).json({ msg: `No posts!` });
    }
    return res.status(400).json({ msg: `Unauthorized!` });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//
//
// Add post
router.post("/:userId", [auth, upload.single("image")], async (req, res) => {
  if (req.user) {
    try {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const post = await Post.create({
          ...req.body,
          image: result.url,
          body: req.body.body || "",
          from: req.params.userId || "",
          createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        });

        return res.status(200).json({ msg: `Posted`, err: false });
      });
    } catch (error) {
      if (req.body.body) {
        const post = await Post.create({
          ...req.body,
          image: "",
          body: req.body.body || "",
          from: req.params.userId || "",
          createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        });
        return res.status(200).json({ msg: `Posted!`, err: false });
      }
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const post = await Post.create({
          ...req.body,
          image: result.url,
          body: "",
          from: req.params.userId,
          createdAt: new Date().toLocaleTimeString(),
        });

        return res.status(200).json({ msg: `Posted`, err: false });
      });

      // return res.status(400).json({ msg: `Enter something na`, err: true });
    }
  }
});

//
//
// Get all post by a user
router.get("/:userId", auth, async (req, res) => {
  try {
    if (req.user) {
      const posts = await Post.find({ from: req.params.userId });
      if (posts[0]) {
        return res.status(200).json(posts);
      }
      return res.status(200).json({ msg: "No post!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
