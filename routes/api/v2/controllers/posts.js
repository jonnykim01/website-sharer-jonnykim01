import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res, next) => {
    try {
        let date = new Date();
        const newPost = new req.models.Post({
          url: req.body.url,
          description: req.body.description,
          created_date: date
        });
    
        await newPost.save();
    
        res.type('json');
        res.send({'status': 'success'});
    } catch(error) {
        console.log("Error saving post: ", error);
        res.status(500).json({"status": "error", "error": error});
    }
});

router.get('/', async (req, res, next) => {
    try {
        let previews = [];
        let allPosts = await req.models.Post.find();
        console.log(allPosts);
        allPosts.forEach(post => {
            let obj = {description: post.description, htmlPreview: getURLPreview(post.url)};
            previews.push(obj);
        });
        console.log(previews);
        res.type('json');
        res.send(previews);
    } catch(error) {
        console.log("Error saving user: ", error);
        res.status(500).json({"status": "error", "error": error});
    }
});

export default router;