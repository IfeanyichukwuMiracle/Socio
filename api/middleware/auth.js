const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const user = jwt.verify(authHeader, process.env.JWT_KEY);
    if (user) {
      req.user = user;
      next();
      return;
    }
    return;
  }
  console.log(`Unauthorized`);
};

module.exports = auth;
