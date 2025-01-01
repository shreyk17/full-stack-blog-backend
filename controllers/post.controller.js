import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ success: true, data: posts });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.status(200).json({ success: true, data: post });
};

export const createPost = async (req, res) => {
  const newPost = new Post(req.body);

  const post = await newPost.save();

  res
    .status(201)
    .json({ success: true, message: "Post created successfully!", data: post });
};

export const deletePost = async (req, res) => {
  const deletePost = await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    success: true,
    message: "Post deleted successfully!",
  });
};
