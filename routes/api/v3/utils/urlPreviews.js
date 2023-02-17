import fetch from 'node-fetch';
import parser from 'node-html-parser';

async function getURLPreview(url) {
    var preview = '';
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
            if (tagProp == 'og:title' || tagProp == 'og:url' || tagProp == 'og:image' || tagProp == 'og:description' || 'og:locale') {
                return true;
            } else {
                return false;
            }
        });

        // extract contents from page
        var description = '';
        var title = '';
        var image = '';
        var locale = '';
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
            } else if (propTag == 'og:locale') {
                locale = contTag;
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
        preview = `
            <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center; margin: auto; width: 50%;">
                <a href=${url}>
                    <p><strong>
                        ${title}
                    </strong></p>
                    ${image != '' ? '<img src="' + image + '" style="max-height: 200px; max-width: 270px;">' : ''}
                </a>
                ${description != '' ? '<p>' + description + '</p>' : ''}
                ${locale != '' ? '<p>' + locale + '</p>' : ''}
            </div>
        `;
    } catch {
        let error = '<div>There was an error loading your page. Please try again.</div>'
        return error;
    }
    return preview;
}

export default getURLPreview;  