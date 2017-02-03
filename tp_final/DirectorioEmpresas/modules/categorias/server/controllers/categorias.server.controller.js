'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categoria = mongoose.model('Categoria'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Categoria
 */
exports.create = function(req, res) {
  var categoria = new Categoria(req.body);
  categoria.user = req.user;

  categoria.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoria);
    }
  });
};

/**
 * Show the current Categoria
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var categoria = req.categoria ? req.categoria.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  categoria.isCurrentUserOwner = req.user && categoria.user && categoria.user._id.toString() === req.user._id.toString();

  res.jsonp(categoria);
};

/**
 * Update a Categoria
 */
exports.update = function(req, res) {
  var categoria = req.categoria;

  categoria = _.extend(categoria, req.body);

  categoria.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoria);
    }
  });
};

/**
 * Delete an Categoria
 */
exports.delete = function(req, res) {
  var categoria = req.categoria;

  categoria.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoria);
    }
  });
};

/**
 * List of Categorias
 */
exports.list = function(req, res) {
  Categoria.find().sort('-created').populate('user', 'displayName').exec(function(err, categorias) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categorias);
    }
  });
};

/**
 * Categoria middleware
 */
exports.categoriaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categoria is invalid'
    });
  }

  Categoria.findById(id).populate('user', 'displayName').exec(function (err, categoria) {
    if (err) {
      return next(err);
    } else if (!categoria) {
      return res.status(404).send({
        message: 'No Categoria with that identifier has been found'
      });
    }
    req.categoria = categoria;
    next();
  });
};
