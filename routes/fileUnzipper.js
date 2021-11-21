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
router.post('/', upload.single('file'), async function (req, res, next) {
  var zip = new AdmZip(req.file.buffer);
  var zipEntries = zip.getEntries();
  var ret = []
  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.entryName)
    ret.push({
      'path': zipEntry.entryName,
      'file': zipEntry.getData()
    })
  });
  res.send(ret)
});

module.exports = router;
