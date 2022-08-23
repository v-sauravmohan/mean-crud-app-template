const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const Post = require("./models/post");

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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  res.status(201).send({ message: "Post Created Successfully!" });
});

app.delete("/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).send({ message: "Post Deleted Successfully!" });
  });
});

app.use("/posts", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Post Fetch Sucess",
      posts: posts,
    });
  });
});

module.exports = app;
