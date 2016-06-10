var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Libro = new Schema({
	id: Schema.Types.ObjectId,
	precio: Schema.Types.Number,
	valoracion: Schema.Types.Number,
	data: Schema.Types.Mixed
});

mongoose.model('Libro', Libro);
mongoose.connect('mongodb://localhost/libreria');