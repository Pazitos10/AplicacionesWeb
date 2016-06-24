var mongoose = require('mongoose');
var Libro = mongoose.model('Libro');
var books = require('google-books-search');


function get_libros(filtro) {
    var condicion = filtro ? {'data.title': new RegExp(filtro,'i') } : {};
    return Libro.find(condicion); //.select('data.title -_id');
}

exports.books = function(req, res, next) {
    get_libros().exec().then(function (libros) {
        res.json({ books: libros });
    })
}

exports.show = function(req, res, next) {
    var book_id = req.params.id;
    if(book_id){
        books.lookup(book_id, function(error, result) {
            res.json({ book: result });
        });
    }else
        res.json({ book: "error: especificar un id de libro correcto"});
}

exports.search = function (req, res, next) {
    if (req.method === "GET"){
        res.json({ resultados: [], resultados_db: [] });
    } else {
        var termino = req.body.search_term;
        var options = {'limit': 40};
        get_libros(termino).exec().then(function (resultados_db) {
            books.search(termino, options, function(error, results) {
                if ( ! error ){
                    res.json({resultados: results, resultados_db: resultados_db});
                }
            });
        });
    }
}

exports.save = function (req, res, next) {
    var book_to_save = req.params.id;
    if(book_to_save){
        books.lookup(book_to_save, function(error, result) {
            if (result){
/*                new Libro({
                    valoracion : 5,
                    precio: 1000.50,
                    data: result
                }).save(function(err, libro, count){
                    //console.log(libro, "Guardado!");
                })
*/              res.json({msg: "Libro Guardado!"})
            }else
                res.json({msg: "Error: no se encontro el id: "+ book_to_save })
        });
    }else
        res.json({msg: "Error: especificar un id de libro correcto" });
}