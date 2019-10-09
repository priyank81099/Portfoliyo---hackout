const express = require("express");
const router = express.Router();
const Projects = require("../models/project");
const checkAuth = require("../middleware/checkAuth");

const getProjects = (req, res) => {
  Projects.find()
    .populate("createdby", ["fname", "lname", "email"])
    .exec((err, response) => {
      if (err) {
        return res.status(400).json({ message: "Quering data is failed" });
      } else if (response.length !== 0) {
        res.status(201).json(response);
      } else {
        res.status(401).json({ message: "Not Project submitted" });
      }
    });
};

const getUserProject = (req, res) => {
  Projects.find()
    .populate("createdby", ["fname", "lname", "email"])
    .exec((err, response) => {
      const newResponse = response.map(data => {
        if (data.createdby.email === req.params._id) {
          return data;
        }
      });
      let vart = newResponse.filter(Boolean);
      console.log(vart);
      if (err) {
        return res.status(400).json({ message: "Quering data is failed" });
      } else if (newResponse[0] != null) {
        return res.status(201).json(vart);
      } else {
        return res.status(401).json({ message: "Not Project submitted" });
      }
    });
};

const postUserProject = (req, res) => {
  const { name, description, link, createdby } = req.body;
  const project = new Projects({
    name,
    description,
    link,
    createdby
  });
  console.log(project);
  project
    .save(project)
    .then(response => {
      if (response) {
        res.status(200).json({ message: "Project saved successfully" });
      } else {
        return res.status(401).json({ message: "Not Project submitted" });
      }
    })
    .catch(err => res.status(401).json({ err }));
};

const deleteProject = (req, res) => {
  Projects.findByIdAndDelete(req.params._id).exec((err, response) => {
    if (err) {
      return res.status(400).json({ message: "Project is not deleted" });
    } else if (response) {
      res.status(200).json({ message: "Project deleted" });
    } else {
      return res.status(401).json({ message: "Not Project exist" });
    }
  });
};

router.get("/:_id", checkAuth, getUserProject);
router.get("/", getProjects);
router.post("/", checkAuth, postUserProject);
router.delete("/:_id", checkAuth, deleteProject);
module.exports = router;
