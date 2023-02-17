import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async (req, res, next) => {
    var url = req.query.url;
    let preview = await getURLPreview(url);
    res.type('text');
    res.send(preview);
});

export default router;