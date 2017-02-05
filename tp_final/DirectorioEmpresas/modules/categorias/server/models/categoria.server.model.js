'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Categoria Schema
 */
var CategoriaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Por favor, ingrese el nombre de la Categoría',
    lowercase: true,
    trim: true
  },
  google_equivalent: {
    type: String,
    default: '',
    required: false,
    lowercase: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Categoria', CategoriaSchema);
