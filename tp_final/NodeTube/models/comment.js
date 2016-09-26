var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
	video: {type: Schema.Types.ObjectId, ref: 'Video', required: true},
	body: {type: String, required: true},
	likes: Number,
	dislikes: Number,
	replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
},{ timestamps: true });

module.exports = mongoose.model('Comment', Comment);