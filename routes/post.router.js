import express from 'express';

import upload from '../config/multer.config.js';

import { createPost, getAllPostsByUserId, getPostById, deletePost, likePost, commentPost, getAllLikedPosts,getAllCommentedPosts } from '../controllers/post.controller.js';
import { get } from 'http';

const postRouter = express.Router();

// create a post by logged in user
postRouter.post('/create', upload.single('image'), createPost);

// get all posts by userId
postRouter.get('/:userId', getAllPostsByUserId);

// for edit need to make other route on frontend so no editing for now

//delete post by id by author who is logged in
postRouter.delete('/:postId', deletePost);

//like a post
postRouter.put('/like/:postId', likePost);

// get all post liked by logged in user
postRouter.get('/liked/me', getAllLikedPosts);

//comment on a post
postRouter.post('/comment/:postId', commentPost);

// get all post commented by user id
postRouter.get('/commented/me', getAllCommentedPosts);



//get a post by id 
postRouter.get('/:id', getPostById);




export default postRouter;