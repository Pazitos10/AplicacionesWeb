var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Libro = new Schema({
	id: Schema.Types.ObjectId,
	votos_positivos: Schema.Types.Number,
	votos_total: Schema.Types.Number,
	data: Schema.Types.Mixed
});

mongoose.model('Libro', Libro);
mongoose.connect('mongodb://localhost/libreria');