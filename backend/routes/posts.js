const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
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
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "-" + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage }).single("thumbnail"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/thumbnails/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((createdPost) =>
      res.status(201).send({
        message: "Post Created Successfully!",
        post: { ...createdPost, post_id: createdPost._id },
      })
    );
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted Successfully!" });
      } else {
        res.status(401).json({ message: "User Not Authorized!" });
      }
    }
  );
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage }).single("thumbnail"),
  (req, res, next) => {
    let imagePath = req.body.thumbnail;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/thumbnails/" + req.file.filename;
    }
    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Post Updated Successfully!" });
      } else {
        res.status(401).json({ message: "User Not Authorized!" });
      }
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch(() => res.status(404).json({ message: "Post Not Found!" }));
});

router.use("", (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((posts) => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post Fetch Success",
        posts: fetchedPosts,
        count: count,
      });
    });
});

module.exports = router;
