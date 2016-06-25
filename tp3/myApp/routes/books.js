var express = require('express');
var router = express.Router();
var api = require('./api')

/* GET home page. */
router.get('/', api.books);

router.get('/search', api.search);
router.get('/show/:id', api.show);

router.post('/search', api.search);
router.post('/save/:id', api.save);

router.post('/vote/like/:id', api.like);
router.post('/vote/dislike/:id', api.dislike);
router.post('/vote/later/:id', api.later);

module.exports = router;
