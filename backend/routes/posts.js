const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/thumbnails");
  },
  filename: (req,file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '-' +ext);
  }
});

router.post("", multer({storage}).single('thumbnail'), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) =>
    res.status(201).send({
      message: "Post Created Successfully!",
      post_id: createdPost._id,
    })
  );
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).send({ message: "Post Deleted Successfully!" });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Post Updated Successfully!" });
  });
});

router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post Not Found!"})
    }
  }).catch(() => res.status(404).json({message: "Post Not Found!"}));
});

router.use("", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Post Fetch Sucess",
      posts: posts,
    });
  });
});

module.exports = router
