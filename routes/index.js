const request = require('request');
const express = require('express');
const multer = require('multer')
const router = express.Router();
const fs = require('fs');
const FormData = require('form-data')

const getFileName = name => ('file' + name.split('.').slice(1).join('.'))

const upload = multer({
  storage: multer.diskStorage({
      destination: 'public/uploads/',
      filename: function(req, file, cb) {
          cb(null, file.originalname)
      }
  })});

let toolID = 'f6ae660c-cd4b-463e-a400-75ec4e03f93e';

router.get('/setToolId/:toolId', function(req, res) {
  toolId = req.params.toolId
  res.send('ok');
})

router.post('/', upload.single('partFile'), async function(req, res) {
  const filename = req.file.filename;
  const formData = {
    fileUnits: 'mm',
    file: {
      value: fs.createReadStream(req.file.path),
      options: {
        filename,
        contentType: 'application/octet-stream',
        contentDisposition: 'form-data'
      }
    }
  }

  request.post({
      url: `https://imatsandbox.materialise.net/web-api/tool/${toolID}/model`,
      formData,
      headers: {
        'Accept': 'text/json',
        'User-Agent': 'my-reddit-client'
      }
    },
    function(err, httpResponse, body) {
      if (err) {
        res.json(err);
      }
      console.log('Upload successful!  Server responded with:', body);
      res.json(JSON.parse(body));
    },
  )
});

router.get('/', function(req, res) {
  res.render('index', { title: 'Soros' });
});

module.exports = router;
