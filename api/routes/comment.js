const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../schema/comments");

//
// Comment to a post
router.post("/:postId", auth, async (req, res) => {
  if (req.user) {
    const comment = await Comment.create({
      from: req.body.from,
      to: req.params.postId,
      body: req.body.body,
      username: req.body.username,
      createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
    });
    return res.status(200).json(comment);
  }
  return res.status(400).json({ msg: `Unauthorized!` });
});

//
// Get all comments for a post
router.get("/:postId", auth, async (req, res) => {
  if (req.user) {
    const { postId } = req.params;

    const comments = await Comment.find({ to: postId });
    const [first, ...rest] = comments;

    if (first) {
      return res.status(200).json(comments);
    }
    return res.status(200).json({ msg: `No Comments!` });
  }
  return res.status(400).json({ msg: `Unauthorized!` });
});

module.exports = router;
