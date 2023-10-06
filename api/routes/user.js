const express = require("express");
const router = express.Router();
const User = require("../schema/users");
const CryptoJs = require("crypto-js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { upload, cloudinary } = require("../controllers/upload");
const nodemailer = require("nodemailer");

// CREATE / REGISTER USER => SIGN UP
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (username && password && email) {
      const newPassword = CryptoJs.AES.encrypt(
        password,
        process.env.PASSWORD_KEY,
      ).toString();

      const user = await User.create({
        ...req.body,
        password: newPassword,
        bio: "",
        profileImg: "",
      });
      return res.status(200).json(user);
    }

    return res.status(400).json({ msg: `Enter all details!` });
  } catch (error) {
    return res.status(400).json(error);
  }
});

//
// LOGIN EXISTING USER
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const user = await User.findOne({ username });
      if (user) {
        const { password: pwd, ...rest } = user._doc;
        if (
          password ===
          CryptoJs.AES.decrypt(
            user.password,
            process.env.PASSWORD_KEY,
          ).toString(CryptoJs.enc.Utf8)
        ) {
          const token = await jwt.sign(rest, process.env.JWT_KEY, {
            expiresIn: "6000m",
          });
          return res.status(200).json({ ...rest, token });
        }
        return res.status(400).json({ msg: `Wrong password` });
      }
      return res.status(400).json({ msg: `No such user!` });
    }
    return res.status(400).json({ msg: `Enter details!` });
  } catch (error) {
    return res.status(400).json(error);
  }
});

//
// EDIT USER PROFILE ---------------------------------------------- ERROR HERE
router.put(
  "/profile/:userId",
  [auth, upload.single("image")],
  async (req, res) => {
    if (req.user) {
      const { userId } = req.params;
      try {
        const { username, bio } = req.body;
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
          if (err) {
            console.log(err);
            return;
          }

          console.log(`Uploaded!`);
          const firstUser = await User.findOne({ _id: userId });
          if (firstUser) {
            console.log(firstUser);
            const user = await User.findOneAndUpdate(
              { _id: userId },
              {
                username: username || firstUser.username,
                profileImg: result.url || firstUser.profileImg,
                bio: bio || firstUser.bio || "",
              },
              { new: true },
            );

            console.log(user);
            return res.status(200).json({ msg: `Updated!`, ...user });
          }
        });
        return;
      } catch (error) {
        const firstUser = await User.findOne({ _id: userId });
        if (firstUser) {
          const user = await User.findOneAndUpdate(
            { _id: userId },
            {
              username: req.body.username || firstUser.username,
              profileImg: "" || firstUser.profileImg,
              bio: req.body.bio || firstUser.bio,
            },
            { new: true },
          );
          return res.status(200).json({ msg: `Updated!`, ...user });
        }
      }
    }
    return res.status(400).json({ msg: `Unauthorized!` });
  },
);

//
//
// GET A USER
router.get("/:userId", auth, async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findOne({ _id: req.params.userId });
      if (user) {
        return res.status(200).json(user);
      }

      return res.status(400).json({ msg: `No user!` });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

//
//
//
//
//
// FORGOT PASSWORD --------------------------------------------------------------------------------------------------------
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    pass: process.env.APP_PWD,
    user: "ifeanyimiraclechuks@gmail.com",
  },
});
const mailOptions = (receiver, key) => {
  return {
    from: "ifeanyimiraclechuks@gmail.com",
    to: receiver,
    subject: "Password Recovery",
    html: `<h2>Use the key to access app</h2><h1 style="color:blue;">${key}</h1><h2>Key expires in 30 minutes</h2>`,
  };
};

function createNewNum() {
  let num = [];
  for (let i = 0; i < 6; i++) {
    num.push(Math.floor(Math.random() * 10));
  }
  return String(num.join(""));
}
// OTP KEY VARIABLE
let otpKey;

router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  otpKey = createNewNum();

  setTimeout(() => {
    otpKey = "00000000000";
    // console.log(otpKey);
  }, 1800000);
  try {
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        transport.sendMail(mailOptions(email, otpKey), (err, result) => {
          if (err) {
            // console.log(err);
            return;
          }

          // console.log(result.response);
          // console.log(otpKey);
          return res.status(200).json({ msg: result.response });
        });
      }
      return res.status(400).json({ msg: `No such user!` });
    }
    return res.status(400).json({ msg: "Enter email!" });
  } catch (error) {
    // console.log(error);
    return res.status(400).json(error);
  }
});

//
// ENTER OTP
router.post("/reset/:userEmail", async (req, res) => {
  const { otp, newPassword } = req.body;
  const { userEmail } = req.params;

  if (otp == otpKey && otp && newPassword) {
    const pwd = CryptoJs.AES.encrypt(
      newPassword,
      process.env.PASSWORD_KEY,
    ).toString();

    try {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        const newUser = await User.findOneAndUpdate(
          { email: userEmail },
          { password: pwd },
          { new: true },
        );
        return res.status(200).json(newUser);
      }
      return res.status(400).json({ msg: `no user` });
    } catch (error) {
      console.log(error);
      return;
    }
  }
  return res.status(400).json({ msg: `Can't reset password` });
});

module.exports = router;
