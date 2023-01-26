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
        var filteredMeta = metaTags.filter(tag => {
            let tagProp = tag.getAttribute('property');
            if (tagProp == 'og:title' || tagProp == 'og:url' || tagProp == 'og:image' || tagProp == 'og:description') {
                return true;
            } else {
                return false;
            }
        });

        // extract contents from page
        var description = '';
        var title = '';
        var image = '';
        filteredMeta.forEach(tag => {
            console.log(tag);
            let propTag = tag.getAttribute('property');
            let contTag = tag.getAttribute('content');
            console.log(propTag);
            console.log(contTag);
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

        if (title == '') {
            let titleTag = htmlPage.querySelector('title').innerHTML;
            if (titleTag == undefined) {
            title = url;
            } else {
                title = titleTag;
            }
        }

        // set preview html and send
        /*let preview = `
            <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
                <a href=${url}>
                    <p><strong> 
                        ${title}
                    </strong></p>
                    ${image != '' ? '<img src="' + image + '" style="max-height: 200px; max-width: 270px;">' : ''}
                </a>
                ${description != '' ? '<p>' + description + '</p>' : ''}
            </div>
        `;*/
        let preview = '';
        preview += '<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">';
        preview += '<a href="' + url + '">';
        preview += '<p><strong>' + title + '</strong></p>';
        if (image != '') {
            preview += '<img src="' + image + '" style="max-height: 200px; max-width: 270px;">';
        }
        preview += '</a>';
        if (description != '') {
            preview += '<p>' + description + '</p>';
        }
        preview += '</div>';
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