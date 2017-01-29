'use strict';

/**
 * Module dependencies.
 */
// [START imports]
var firebase = require('firebase-admin');
// [END imports]

var path = require('path'),
  mongoose = require('mongoose'),
  Empresa = mongoose.model('Empresa'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


var serviceAccount = require(path.resolve('./serviceAccountKey.json'));

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://directorioempresas-74f45.firebaseio.com'
});

/**
 * Create a Empresa
 */
exports.create = function (req, res) {
  var empresa = new Empresa(req.body);
  empresa.user = req.user;

  empresa.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

/**
 * Show the current Empresa
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var empresa = req.empresa ? req.empresa.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  empresa.isCurrentUserOwner = req.user && empresa.user && empresa.user._id.toString() === req.user._id.toString();

  res.jsonp(empresa);
};

/**
 * Update a Empresa
 */
exports.update = function (req, res) {
  var empresa = req.empresa;

  empresa = _.extend(empresa, req.body);

  empresa.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

/**
 * Delete an Empresa
 */
exports.delete = function (req, res) {
  var empresa = req.empresa;

  empresa.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

/**
 * List of Empresas
 */
exports.list = function (req, res) {
    console.log("PASO POR ACA");
  console.log("DALE");
  var empresas = firebase.database().ref('/empresas');
  empresas.limitToFirst(1).on("value", function(snapshot) {
      console.log(snapshot.val());
      res.jsonp(snapshot);
  }, function (errorObject) {
      return res.status(400).send({
          message: errorObject.code
      });

  });
  console.log("termine");
  /*
  Empresa.find().sort('-created').populate('user', 'displayName').exec(function (err, empresas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(empresas);
      res.jsonp(empresas);
    }
  });
  */
};

/**
 * Empresa middleware
 */
exports.empresaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Empresa is invalid'
    });
  }

  Empresa.findById(id).populate('user', 'displayName').exec(function (err, empresa) {
    if (err) {
      return next(err);
    } else if (!empresa) {
      return res.status(404).send({
        message: 'No Empresa with that identifier has been found'
      });
    }
    req.empresa = empresa;
    next();
  });

};
