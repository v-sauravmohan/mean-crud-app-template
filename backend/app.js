const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://mean-admin:YB7noW7ii4iMrhm7@cluster0.g1uv1yt.mongodb.net/mean-course?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => console.log(error));

// To resolve cors error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/thumbnails", express.static(path.join("backend/thumbnails")));

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

module.exports = app;
