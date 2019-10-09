const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Auth is failed" });
  }
};
