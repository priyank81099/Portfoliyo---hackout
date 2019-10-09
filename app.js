const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const PORT = 5000;

const auth = require("./routers/auth");
const project = require("./routers/project");

mongoose.connect("mongodb://localhost:27017/devfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Database...");
});

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/user", auth);
app.use("/project", project);

app.get("/", (req, res) => {
  res.json({ message: "TESTING.." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
