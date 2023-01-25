import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';
var router = express.Router();

router.get('/urls/preview', async (req, res, next) => {
    // get url from query parameter
    var url = req.query.url;

    // try to fetch url
    try {
        let response = await fetch(url);
        let responseText = await response.text();

        // parse contents to html
        let htmlPage = parser.parse(responseText);

        // extract meta tags
        let metaTags = htmlPage.querySelectorAll('meta');

        // filter meta tags for title, url, image, and description
        let filteredMeta = metaTags.filter(tag => {
            let tagProp = tag.getAttribute('property');
            if (tagProp == 'og:title' || tagProp == 'og:url' || tagProp == 'og:image' || tagProp == 'og:description') {
                return true;
            } else {
                return false;
            }
        });

        // check if the title and url exists
        var titleExists = false;
        var urlExists = false;

        filteredMeta.forEach(tag => {
            if (tag.getAttribute('property') == "og:title") {
                titleExists = true;
            } else if (tag.getAttribute('property') == "og:url") {
                urlExists = true;
            }
        });

        if (!urlExists) {
            filteredMeta.push(`
                <meta property='og:url' content=${url} />
            `);
        }

        if (!titleExists) {
            let title = htmlPage.querySelector('title').innerHTML;
            if (title == undefined) {
                filteredMeta.push(`
                    <meta property='og:title' content=${url} />
                `);
            } else {
                filteredMeta.push(`
                    <meta property='og:title' content=${title} />
                `);
            }
        }

        // extract contents from page
        var description = '';
        var title = '';
        var image = '';
        filteredMeta.forEach(tag => {
            let propTag = tag.getAttribute('property');
            let contTag = tag.getAttribute('content');
            if (propTag == 'og:url') {
                url = contTag;
            } else if (propTag == 'og:title') {
                title = contTag;
            } else if (propTag == 'og:description') {
                description = contTag;
            } else if (propTag == 'og:image') {
                image = contTag;
            }
        });

        // set preview html and send
        let preview = `
            <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <a href=${url}>
                    <p><strong> 
                        ${title}
                    </strong></p>
                    <img src=${image} style="max-height: 200px; max-width: 270px;">
                </a>
                <p>${description}</p>
            </div>
        `;
        res.type("html");
        res.send(preview);
    } catch {
        let error = `
            <p>There was an error loading your page, please try again</p>
        `;
        res.type('html');
        res.send(error);
    }
});

export default router;