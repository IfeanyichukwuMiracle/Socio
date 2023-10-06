require("dotenv").config();

const multer = require("multer");
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./uploads");
  // },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = { upload, cloudinary };
