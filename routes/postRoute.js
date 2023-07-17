const { Router } = require("express");
const { PostModel } = require("../models/postModel");
const { auth } = require("../middleware/auth.middleware");
const postRouter = Router();

postRouter.use(auth);

/// The logged in user can create posts.
postRouter.post("/create", async (req, res) => {
  try {
    console.log("inside create", req.userId, req.username);
    let { title, body, device } = req.body;
    let post = await PostModel.create({
      title,
      body,
      device,
      creatorname: req.username,
      creator: req.userId,
    });
    res.status(201).send({
      msg: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while creating post",
      error: error.message,
    });
  }
});

/// This will show the posts of logged in users.
postRouter.get("/", async (req, res) => {
  try {
    const { deviceQuery } = req.query;
    const userId = req.userId;
    console.log("inside / get", req.userId, req.username);
    let query = { creator: userId };
    if (deviceQuery) {
      query.device = deviceQuery;
    }
    let posts = await PostModel.find(query);
    res.status(201).send({
      msg: "Post fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while getting posts",
      error: error.message,
    });
  }
});

/// The logged in user can update his/her posts.
postRouter.patch("/update/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const payload = req.body;

    const { id } = req.params;
    const post = await PostModel.findById(id);

    const postCretorId = post.creator.toString();
    console.log(postCretorId === userId);
    if (postCretorId !== userId) {
      res.status(400).send({
        msg: "Not authorized for updating post",
      });
      return;
    }

    const updatedpost = await PostModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    res.status(200).send({
      msg: "Post updated successfully",
      updatedpost,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while updating post",
      error: error.message,
    });
  }
});

// The logged in user can delete his/her posts.
postRouter.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.userId;

    const { id } = req.params;
    const post = await PostModel.findById(id);

    const postCretorId = post.creator.toString();

    if (postCretorId !== userId) {
      res.status(400).send({
        msg: "Not authorized for deleting post",
      });
      return;
    }

    const deletedpost = await PostModel.findByIdAndDelete(id);
    res.status(200).send({
      msg: "Post deleted successfully",
      deletedpost,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while deleting post",
      error: error.message,
    });
  }
});

module.exports = { postRouter };
