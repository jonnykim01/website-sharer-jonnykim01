import express from 'express';
let router = express.Router();

import usersRouter from './controllers/users.js';
import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);

export default router;