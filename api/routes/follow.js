const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Follow = require("../schema/follow");

//
// Follow a user
router.post("/:userId", auth, async (req, res) => {
  try {
    if (req.user && req.body.follower) {
      const { userId } = req.params;
      const { follower } = req.body;
      const follow = await Follow.create({ followed: userId, follower });

      return res.status(200).json({ ...follow, msg: `Following` });
    }

    return res.status(400).json({ msg: `Can't follow!` });
  } catch (error) {
    console.log(error);
    return;
  }
});

//
// Un-follow a user
router.delete("/:userId/:follower", auth, async (req, res) => {
  try {
    if (req.user && req.params.follower) {
      const { userId, follower } = req.params;

      await Follow.findOneAndDelete({ followed: userId, follower });
      return res.status(200).json({ msg: `not following!` });
    }

    return res.status(400).json({ msg: `Can't perform this action` });
  } catch (error) {
    console.log(error);
    return;
  }
});

//
// get all followers of a user
router.get("/followers/:userId", auth, async (req, res) => {
  if (req.user) {
    try {
      const { userId } = req.params;
      // const followers = await Follow.where(`followed`).equals(`${userId}`);
      const followers = await Follow.find({ followed: userId });
      return res.status(200).json(followers);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return res.status(400).json({ msg: `Unauthorized::: Login!` });
});

//
// get all followed by a user
router.get("/following/:userId", auth, async (req, res) => {
  if (req.user) {
    try {
      const { userId } = req.params;
      const followings = await Follow.find({ follower: userId });

      return res.status(200).json(followings);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return res.status(400).json({ msg: `Unauthorized!` });
});

//
//
//
module.exports = router;
