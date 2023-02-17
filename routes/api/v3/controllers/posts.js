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


            res.json({'status': 'success'});
        } catch(error) {
            console.log("Error saving user: ", error);
            console.log("Error saving posts: ", error);
            res.status(500).json({"status": "error", "error": error});
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
            let obj = {username: allPosts[i].username, description: allPosts[i].description, htmlPreview: preview};
            previews.push(obj);
        }

        res.json(previews);
    } catch (error) {
        console.log("Error saving user: ", error);
        console.log("Error saving posts: ", error);
        res.status(500).json({"status": "error", "error": error});
    }
});

export default router;