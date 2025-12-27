
import express from 'express';
import upload from '../config/multer.config.js';

import { getProfile, updateProfile, deleteProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

// get user profile by id
userRouter.get('/:userId', getProfile);

// get user profile of logged in user
userRouter.get('/me', getProfile);

//update profile of logged in user
userRouter.put('/updateProfile', upload.single('profilePicture'), updateProfile);

// delete profile of logged in user
userRouter.post('/deleteProfile', deleteProfile);

export default userRouter;