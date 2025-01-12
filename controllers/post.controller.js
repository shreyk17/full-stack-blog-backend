import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import slugify from "slugify";

// IMAGEKIT KEYS
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const getPosts = async (req, res) => {
  // getting the page number
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const posts = await Post.find()
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPost = await Post.countDocuments();

  const hasMore = page * limit < totalPost;
  res.status(200).json({ success: true, data: posts, hasMorePost: hasMore });
  //res.status(200).json({posts, hasMore});
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

  // create new slug for each post from title
  //   let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  //   let existingPost = await Post.findOne({ slug });

  //   let counter = 2;

  //   while (existingPost) {
  //     slug = `${slug}-${counter}`;
  //     existingPost = await Post.findOne({ slug });
  //     counter++;
  //   }

  const cleanTitle = req.body.title.trim().replace(/\s+/g, " "); // Replace multiple spaces with a single space
  const slug = slugify(cleanTitle, { lower: true, strict: true });
  //let slug = slugify(req.body.title, { lower: true, strict: true });
  let existingItem = await Post.findOne({ slug });
  let uniqueSlug = slug;
  let counter = 1;

  while (existingItem) {
    uniqueSlug = `${slug}-${counter}`;
    existingItem = await Post.findOne({ slug: uniqueSlug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug: uniqueSlug, ...req.body });

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

export const uploadAuth = async (req, res) => {
  const results = imagekit.getAuthenticationParameters();
  res.send(results);
};
