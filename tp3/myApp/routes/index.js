var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/libros/buscar', function(req, res, next) {
  res.render('books/search', { title: 'Buscar' });
});


module.exports = router;
