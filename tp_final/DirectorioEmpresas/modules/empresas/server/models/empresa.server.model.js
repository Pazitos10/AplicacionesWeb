'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Localidad Schema
 */

var Localidad = mongoose.model('localidades', new Schema());

/**
 * Empresa Schema
 */

var EmpresaSchema = new Schema({
  razonSocial: {
    type: String,
    default: '',
    required: 'Ingrese Razón Social de la Empresa',
    trim: true
  },
  cuit: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  domicilio: {
    type: String,
    default: '',
    required: 'Ingrese Domicilio de la Empresa',
    trim: true
  },
  /*
  localidad: {
    type: Schema.ObjectId,
    ref: Localidad,
    required: 'Ingrese Localidad de la Empresa',
  },
  */
  telefono: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  website: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  icon : {
    type: String,
    default: '',
    required: false,
    trim: true,
  }, //Google Icon
  place_id : {
    type: String,
    default: '',
    required: false,
    trim: true,
  }, //Google Place Id
  google_id : {
    type: String,
    default: '',
    required: false,
    trim: true,
  }, //Google Id
  categorias: {
    type: [String],
    default: [],
    required: false
  },
  location: {
    type: [Number],  // [<lat>, <long>]
    index: '2d',     // create the geospatial index
    required: false
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

mongoose.model('Empresa', EmpresaSchema);
