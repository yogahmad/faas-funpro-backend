var express = require('express');
var router = express.Router();
var AdmZip = require('adm-zip');
const multer = require('multer');
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage, preservePath: true });


router.post('/', upload.any(), async function (req, res, next) {
    var zip = new AdmZip();
    req.files.forEach((file) => {
        console.log(file.buffer)
        zip.addFile(file.fieldname, file.buffer)
    })

    res.send(zip.toBuffer().toJSON())
});

module.exports = router;
