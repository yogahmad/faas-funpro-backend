var express = require('express');
var router = express.Router();
const got = require('got');
const axios = require('axios')
var AdmZip = require('adm-zip');

router.post('/get-images-url', async function (req, res, next) {
    var id = getIdFromUrl(req.body.url)
    var URL = `https://api.imgur.com/post/v1/albums/${id}?client_id=546c25a59c58ad7&include=media%2Cadconfig%2Caccount`
    var response = await got(URL)
    response = JSON.parse(response.body)
    var medias = response.media.map(value => value.url)

    res.send(medias)
});

async function get(url) {
    const options = {
        method: 'GET',
        url: url,
        responseType: "arraybuffer"
    };
    const { data } = await axios(options);
    return data;
}

router.post('/download-from-urls', async function (req, res, next) {
    var urls = req.body.urls
    images = await Promise.all(
        urls.map(url => get(url))
    )
    var zip = new AdmZip();
    var ret = []

    images.forEach((image, index) => {
        console.log(urls[index].split("/")[urls[index].split("/").length - 1])
        zip.addFile(urls[index].split("/")[urls[index].split("/").length - 1], image)
    });

    console.log(zip.toBuffer().toJSON())


    res.send(zip.toBuffer().toJSON())
});


function getIdFromUrl(url) {
    var splitted_url = url.split("/")
    var ret = splitted_url.length - 1
    while (splitted_url[ret].length == 0)
        ret -= 1
    return splitted_url[ret]
}

module.exports = router;
