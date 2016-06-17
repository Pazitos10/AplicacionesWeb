var express = require('express');
var router = express.Router();
var api = require('./api')

/* GET home page. */
router.get('/', api.books);

router.get('/search', api.search);
router.get('/show/:id', api.show);

router.post('/search', api.search);
router.post('/save/:id', api.save);


module.exports = router;
