var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Book Search' });
});

router.get('/libros/buscar', function(req, res, next) {
 	res.render('books/search', { title: 'Buscar'});
});

router.post('/libros/buscar/:search_term?', function(req, res, next) {
 	res.render('books/search', { title: 'Buscar', search_term: req.body.search_term });
});

router.get('/libros/coleccion', function(req, res, next) {
	res.render('books/collection', { title: 'Buscar' });
});

module.exports = router;
