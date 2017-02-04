'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Empresa = mongoose.model('Empresa'),
  User = mongoose.model('User'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * convierte el post con data de Google Places en el body en una Empresa del Modelo
 *
 * @param req
 * @return Empresa
 */
function empresaProxy(req) {
  var empresa = new Empresa();
  // Proxy
  empresa.razonSocial = req.body.name;
  empresa.domicilio = req.body.vicinity;
  empresa.icon = req.body.icon;
  empresa.place_id = req.body.place_id;
  empresa.google_id = req.body.id;
  empresa.categorias = req.body.types;
  empresa.location = [req.body.geometry.location.lat, req.body.geometry.location.lng];
  empresa.user = req.user;

  return empresa;
}

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
 * Importo una empresa de Google Places y la guardo localmente
 * No uso import porque es una palabra reservada (y estuve por lo menos 1 hora hasta darme cuenta!!!!)
 */
exports.importar = function (req, res) {
  console.log('Entré en importar');
  console.log(req);

  var empresa = empresaProxy(req);

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
 * Registra el like/dislike de un lugar/empresa
 * No uso import porque es una palabra reservada (y estuve por lo menos 1 hora hasta darme cuenta!!!!)
 */
exports.vote = function (req, res) {
  console.log('Entré en vote');
  var user = req.body.user;
  var empresa = req.body.empresa;
  var empresa_id = empresa.hasOwnProperty('id') ? empresa.id : empresa._id ; //es google places ("id") o local ("_id")
  var isLike = req.body.like;
  User.findOne({ '_id': user._id }, function(err, user_found){
    if (err) {
      console.log(err);
      res.json({ 'err': err, 'message': 'Hubo un error al actualizar likes del usuario' });
    }

    if(user_found){
      if (isLike)
        user_found.empresasLikeadas.push(empresa_id);
      else
        user_found.empresasLikeadas.pop(empresa_id);
      user_found.save();
    }
  });
  res.json({ 'message': 'done!' });
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
  Empresa.find().sort([['razonSocial','ascending']]).populate('user', 'displayName').exec(function (err, empresas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresas);
    }
  });
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

exports.saveImage = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.empresaUpload).single('newEmpresaImage');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  //Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading image'
        });
      } else {
        var empresa_id = req.body.empresa_id;
        Empresa.findById(empresa_id, function(err, empresa) {
          if (err) {
            console.log('[ERR] en saveImage: ', err);
            return res.status(400).send({ message : 'Error ocurred while updating empresa.img_src: '+err });
          }else{
            empresa.img_src = config.uploads.empresaUpload.dest + req.file.filename;
            empresa.save();
            res.json({ message: 'Changes in empresa.img_src done succesfully!' });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
