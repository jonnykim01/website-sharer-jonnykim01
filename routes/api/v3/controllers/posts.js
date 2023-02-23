import express from 'express';
import session from 'express-session';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let date = new Date();
            const newPost = new req.models.Post({
              url: req.body.url,
              username: req.session.account.username,
              description: req.body.description,
              created_date: date
            });

            await newPost.save();


            res.json({status: 'success'});
        } catch(error) {
            console.log("Error saving post: ", error);
            res.status(500).json({status: "error", "error": error});
        }
    } else {
        res.json({status: "error", error: "not logged in"});
    }
});

router.get('/', async (req, res, next) => {
    try {
        let previews = [];
        let allPosts = await req.models.Post.find();

        for (let i = 0; i < allPosts.length; i++) {
            let preview = await getURLPreview(allPosts[i].url);
            let obj = {username: allPosts[i].username, description: allPosts[i].description, htmlPreview: preview, id: allPosts[i]._id, likes: allPosts[i].likes};
            previews.push(obj);
        }

        res.json(previews);
    } catch (error) {
        console.log("Error retrieving posts: ", error);
        res.status(500).json({status: "error", "error": error});
    }
});

router.post('/like', async (req, res, next) => {
    if (!req.session.isAuthenticated) {
        res.status(401).json({status: "error", error: "not logged in"});
    } else {
        try {
            let postId = req.body.postID;
            let post = await req.models.Post.findById(postId);

            if (!post.likes.includes(req.session.account.username)) {
                post.likes.push(req.session.account.username);
            }

            await post.save();
            
            res.json({status: "success"});
        } catch (error) {
            console.log("Error updating likes: ", error);
            res.status(500).json({status: "error", error: error});
        }
    }
});

router.post('/unlike', async (req, res, next) => {
    if (!req.session.isAuthenticated) {
        res.status(401).json({status: "error", error: "not logged in"});
    } else {
        try {
            let postId = req.body.postID;
            let post = await req.models.Post.findById(postId);

            if (post.likes.includes(req.session.account.username)) {
                post.likes = post.likes.filter(user => {
                    return user !== req.session.account.username;
                });
            }

            await post.save();
            
            res.json({status: "success"});
        } catch (error) {
            console.log("Error updating likes: ", error);
            res.status(500).json({status: "error", error: error});
        }
    }
});

router.delete('/', async (req, res, next) => {
    if (!req.session.isAuthenticated) {
        res.status(401).json({status: "error", error: "not logged in"});
    } else {
        try {
            let postId = req.body.postID;
            let post = await req.models.Post.findById(postId);

            if (post.username !== req.session.account.username) {
                res.status(401).json({status: "error", error: "you can only delete your own posts"});
            } else {
                await req.models.Comment.deleteMany({post: postId});
                await req.models.Post.deleteOne({_id: postId});
            }
            
            res.json({status: "success"});
        } catch (error) {
            console.log("Error updating likes: ", error);
            res.status(500).json({status: "error", error: error});
        }
    }
});

export default router;