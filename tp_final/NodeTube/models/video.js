var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* To store video files */
var path = require('path');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");

var Video = new Schema({
	title: {type: String, default: '', required: true },
	uploader: {type: Schema.Types.ObjectId, ref: 'Account'},
	category: {type: String, ref: 'Category', required: true},
	likes: {type: Number, default: 0},
	dislikes: {type: Number, default: 0},
	views: {type: Number, default: 0},
	description: {type: String, default: ''},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{ timestamps: true })

Video.plugin(filePlugin, {
    name: "video_file",
    upload_to: make_upload_to_model(uploads, 'videos'),
    relative_to: uploads_base
});

module.exports = mongoose.model('Video', Video);