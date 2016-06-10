var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Books' });
});

router.get('/add', function(req, res, next) {
  res.render('books/add', { title: 'Books' });
});


module.exports = router;
