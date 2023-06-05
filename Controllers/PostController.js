import mongoose from "mongoose";
import postModel from "../Models/PostModel.js";
import userModel from "../Models/userModel.js";

export const createPost = async (req, res) => {
  const newPost = new postModel(req.body);
  try {
    await newPost.save();
    res.status(200).json("Post Created!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await postModel.findById(postId);
    if (post.userId == userId) {
      await postModel.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(200).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (post.userId == userId) {
      await postModel.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(200).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: "Post Liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: "Post disliked" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPost = await postModel.find({ userId: userId });
    const followingPosts = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res
      .status(200)
      .json(currentUserPost.concat(...followingPosts[0].followingPosts))
      .sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
