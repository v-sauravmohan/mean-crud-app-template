const Post = require("../models/post");

exports.createPost = (req, res, next) => {
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
  ).catch(err => {
    res.status(500).json({message: "Creating a post failed!"});
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted Successfully!" });
      } else {
        res.status(401).json({ message: "User Not Authorized!" });
      }
    }
  ).catch(err => {
    res.status(500).json({message: "Deleting post failed!"});
  });;
}

exports.updatePost = (req, res, next) => {
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
    if (result.modifiedCount > 0 || result.matchedCount == 1) {
      res.status(200).json({ message: "Post Updated Successfully!" });
    } else {
      res.status(401).json({ message: "User Not Authorized!" });
    }
  }).catch(err => {
    res.status(500).json({message: "Couldn't update post!"});
  });;
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch(() => res.status(500).json({ message: "Fetching post failed!" }));
};

exports.getPosts = (req, res, next) => {
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
    }).catch(err => {
      res.status(500).json({message: "Fetching posts failed!"});
    });;
};
