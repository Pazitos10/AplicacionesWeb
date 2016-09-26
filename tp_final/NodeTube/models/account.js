var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String,
  videos: [{type: Schema.Types.ObjectId, ref: 'Video', default: []}],
  playlists: [{type: Schema.Types.ObjectId, ref: 'PlayList', default: []}],
  disabled: {type: Boolean, default: false}
},{ timestamps: true });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);