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
    required: 'Ingrese CUIT de la Empresa',
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
    required: 'Ingrese Teléfono de la Empresa',
    trim: true
  },
  website: {
    type: String,
    default: '',
    required: 'Ingrese Sitio Web de la Empresa',
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

mongoose.model('Empresa', EmpresaSchema);
