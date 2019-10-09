const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((queryError, user) => {
    if (queryError) {
      console.log(queryError);
      return res
        .status(400)
        .json({ message: "Database query error. Failed to create document." });
    } else if (user === null) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          const { fname, lname, email, password, program, batch } = req.body;
          User.create(
            { fname, lname, email, password: hash, program, batch },
            errorInCreation => {
              if (errorInCreation) {
                console.log(errorInCreation);
                res
                  .status(400)
                  .json({ message: "Database error. Failed to create user." });
              } else {
                const token = jwt.sign(
                  {
                    email,
                    name: fname + " " + lname
                  },
                  process.env.SECRET_KEY,
                  { expiresIn: "1d" }
                );
                res.status(201).json({
                  message: "Successful Authentication",
                  token,
                  user: {
                    fname,
                    lname,
                    email,
                    program,
                    batch
                  }
                });
              }
            }
          );
        });
      });
    } else return res.status(400).json({ message: "Duplicate User Found." });
  });
};

const signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((queryError, user) => {
    if (queryError) {
      console.log(queryError);
      return res.status(400).json({ message: "Database query error" });
    } else if (user == null)
      return res.status(400).json({ message: "User does not exist." });
    else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { email: user.email, name: user.fname + " " + user.lname },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
          );
          // console.log(user);
          res.status(201).json({
            message: "Successful Authentication",
            token,
            user: {
              fname: user.fname,
              lname: user.lname,
              email: user.email,
              program: user.program,
              batch: user.batch,
              _id: user._id,
              imageLink: user.imageLink
            }
          });
        } else {
          return res.status(401).json({
            messages: "Auth failed"
          });
        }
      });
    }
  });
};

const uploadImage = (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, response) => {
    if (err) {
      return res.status(401).json({ message: "Quring the database failed" });
    }
    let user = response;
    console.log(req.file);
    user.imageLink = "http://localhost:5000/" + req.file.path;
    console.log(req.file);
    user
      .save()
      .then(response => {
        console.log(response);
        res.status(201).json(response.imageLink);
      })
      .catch(err =>
        res.status(401).json({ message: "Image uploaded Unsuccessfully!!" })
      );
  });
};

const getUserInfo = (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, response) => {
    if (err) {
      return res.status(401).json({ message: "Quring the database failed" });
    }
    res.status(201).json(response);
  });
};

router.post("/image", upload.single("imageLink"), checkAuth, uploadImage);
router.get("/", getUserInfo);
router.post("/signup", signup);
router.post("/signin", signin);
module.exports = router;
