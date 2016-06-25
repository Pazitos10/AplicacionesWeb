var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Libro = new Schema({
    book_id: Schema.Types.String,
    title: Schema.Types.String,
    rate_pos: {type: Schema.Types.Number, default: 0},
    rate_neg: {type: Schema.Types.Number, default: 0},
    rate_later: {type: Schema.Types.Number, default: 0},
    price: {type: Schema.Types.Number, default: -1},
    isbn: Schema.Types.String
});

mongoose.model('Libro', Libro);
mongoose.connect('mongodb://localhost/libreria');