import express from 'express';

import upload from '../config/multer.config.js';

import { createPost, getAllPostsByUserId, getPostById, deletePost, likePost, commentPost } from '../controllers/post.controller.js';

const postRouter = express.Router();

// create a post by logged in user
postRouter.post('/create', upload.single('image'), createPost);

// get all posts by userId
postRouter.get('/:userId', getAllPostsByUserId);

// for edit need to make other route on frontend so no editing for now

//delete post by id by author who is logged in
postRouter.delete('/:postId', deletePost);

// get all post liked by user id
postRouter.get('/liked/:userId', getAllPostsByUserId);

// get all post commented by user id
postRouter.get('/commented/:userId', getAllPostsByUserId);

//get a post by id 
postRouter.get('/:id', getPostById);



//like a post
postRouter.post('/like/:id', likePost);

//comment on a post
postRouter.post('/comment/:id', commentPost);

export default postRouter;