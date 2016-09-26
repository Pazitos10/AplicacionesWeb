var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayList = new Schema({
	name: {type: String, required: true},
	creator: {type: Schema.Types.ObjectId, ref: 'Channel', required: true },
	videos: [{type: Schema.Types.ObjectId, ref: 'Video'}]
},{ timestamps: true });

module.exports = mongoose.model('PlayList', PlayList);