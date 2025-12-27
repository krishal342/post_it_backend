import express from 'express';

import { getPosts } from '../controllers/home.controller.js';
const homeRouter = express.Router();



homeRouter.get('/', getPosts);

export default homeRouter;