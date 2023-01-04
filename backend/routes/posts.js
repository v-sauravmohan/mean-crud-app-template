const express = require("express");
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controller/post");
const extractFile = require("../middleware/file");
const router = express.Router();


router.post(
  "",
  checkAuth,
  extractFile,
  PostController.createPost
);

router.delete("/:id", checkAuth, PostController.deletePost);

router.put(
  "/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.get("/:id", PostController.getPostById);

router.use("", PostController.getPosts);

module.exports = router;
