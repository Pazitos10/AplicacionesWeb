var express = require('express');
var router = express.Router();
var books = require('google-books-search');
var mongoose = require('mongoose');
var Libro = mongoose.model('Libro');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Books' });
});

router.get('/add', function(req, res, next) {
  res.render('books/add', { title: 'Books', termino: '', resultados: null });
});

router.post('/add', function (req, res, next) {
    console.log(req.body.search_term);
    var termino = req.body.search_term;
    console.log("termino de busqueda", termino);
    books.search(termino, function(error, results) {
        if ( ! error ) {
            console.log("se obtuvieron "+ results.length + " resultados");
            console.log(results);
            res.render('books/add', {title: 'Books', resultados: results, termino: termino})
        } else {
            console.log(error);
        }
    });

});

router.post('/save/:id', function (req, res, next) {
    var book_to_save = req.params.id;
    if(book_to_save){
        books.lookup(book_to_save, function(error, result) {
            if (result){
                console.log(result);
                new Libro({
                    valoracion : 5,
                    precio: 1000.50,
                    data: result
                }).save(function(err, libro, count){
                    console.log(libro, "Guardado!");
                })
            }else{
                res.send(400,"error: no se encontro el id: "+ book_to_save);
            }
        });
    }else
        res.send(400,"error: especificar un id de libro correcto");
});




module.exports = router;
