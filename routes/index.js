const express = require('express');
const { body, param, query} = require('express-validator');
const router = express.Router();
const postsController = require('../controller/posts');
const repliesController = require('../controller/replies');

router.post('/post',
body('name').notEmpty(),
body('content').notEmpty(),
body('user_id').notEmpty(), 
postsController.validateReq,
postsController.createPost);

router.get('/post',postsController.getAllPosts);

router.get('/post/:postId', 
param('postId').notEmpty(), 
postsController.validateReq,
postsController.getPoststById);

router.post('/reply/:postId',
body('name').notEmpty(),
body('content').notEmpty(),
body('user_id').notEmpty(), 
param('postId').notEmpty(), 
repliesController.validateReq,
repliesController.replyToPost);

router.get('/replies/:postId',
param('postId').notEmpty(), 
query('offset').notEmpty(), 
repliesController.validateReq,
repliesController.getAllRepliesOfaPost);

module.exports = router;