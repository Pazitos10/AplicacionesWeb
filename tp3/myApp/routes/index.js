var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Book Search' });
});

router.get('/libros/buscar', function(req, res, next) {
 	res.render('books/search', { title: 'Buscar' });
});

router.get('/libros/coleccion', function(req, res, next) {
	res.render('books/collection', { title: 'Buscar' });
});

module.exports = router;
