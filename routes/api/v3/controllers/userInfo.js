import express from 'express';
import session from 'express-session';
let router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let username = req.query.username;
        let userInfo = await req.models.UserInfo.find({username: username});

        res.json(userInfo);
    } catch (error) {
        console.log("Error loading user info: ", error);
        res.status(500).json({status: "error", error: error});
    }
});

router.post('/', async (req, res, next) => {
    try {
        let username = req.body.username;
        if (await req.models.UserInfo.findOne({username: username}) == undefined) {
            const newUserInfo = new req.models.UserInfo({
                username: username,
                favorite_food: req.body.favorite_food
            });

            await newUserInfo.save();
        } else {
            await req.models.UserInfo.updateOne({username: username}, {favorite_food: req.body.favorite_food});
        }
        
        res.json({status: "success"});
    } catch (error) {
        console.log("Error updating likes: ", error);
        res.status(500).json({status: "error", error: error});
    }
});

export default router;