import express from 'express';
let router = express.Router();

import usersRouter from './controllers/users.js';
import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import commentsRouter from './controllers/comments.js';
import userInfoRouter from './controllers/userInfo.js';

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/comments', commentsRouter);
router.use('/userInfo', userInfoRouter);

export default router;