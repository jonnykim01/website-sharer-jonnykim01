import express from 'express';
let router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let postId = req.query.postID;

        let postComments = await req.models.Comment.find({post: postId});

        console.log(postComments);
        res.json(postComments);
    } catch (error) {
        console.log("Error loading comments: ", error);
        res.status(500).json({status: "error", error: error});
    }
});

router.post('/', async (req, res, next) => {
    if (!req.session.isAuthenticated) {
        res.status(401).json({status: "error", error: "not logged in"});
    } else {
        try {
            let date = new Date();
            let newComment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: date
            });

            await newComment.save();

            res.json({status: "success"});
        } catch (error) {
            console.log("Error creating new comment: ", error);
            res.status(500).json({status: "error", error: error});
        }
    }
});

export default router;