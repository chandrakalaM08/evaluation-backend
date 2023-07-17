var jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.secretKey;

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(400).send({
        msg: "No token found , please provide the token or Log in again",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.username = decoded.username;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong in middleware",
      error: error.message,
    });
  }
};

module.exports = { auth };
