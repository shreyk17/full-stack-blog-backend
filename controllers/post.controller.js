import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ success: true, data: posts });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.status(200).json({ success: true, data: post });
};

export const createPost = async (req, res) => {
  // check clerkUserId
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json({ success: false, message: "Not authorized!" });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  const newPost = new Post({ user: user._id, ...req.body });

  const post = await newPost.save();

  res
    .status(201)
    .json({ success: true, message: "Post created successfully!", data: post });
};

export const deletePost = async (req, res) => {
  // getting clerk userID
  const clerkUserId = req.auth.userId;

  console.log(clerkUserId);

  if (!clerkUserId) {
    return res.status(401).json({ success: false, message: "Not authorized!" });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  const deletePost = await Post.findByIdAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletePost) {
    return res
      .status(403)
      .json({ success: false, message: "You can delete only your post!" });
  }
  res.status(204).json("Post deleted successfully!");
};
