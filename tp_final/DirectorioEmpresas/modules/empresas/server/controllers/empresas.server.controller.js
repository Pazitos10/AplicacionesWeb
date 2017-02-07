'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  crypto = require('crypto'),
  mime = require('mime'), //remover para rollback: npm uninstall mime --save
  mongoose = require('mongoose'),
  Empresa = mongoose.model('Empresa'),
  Categoria = mongoose.model('Categoria'),
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
  empresa.opening_hours = req.body.opening_hours;
  empresa.user = req.user;

  return empresa;
}

/**
 * Create a Empresa
 */
exports.create = function (req, res) {
  var empresa = new Empresa(req.body);
  empresa.categorias = [];
  empresa.user = req.user;

  // if (req.params.eliminar_img === 'true'){
  //   if (errorDeletingOldImg(empresa.img_src)){
  //     return res.status(400).send({
  //       message: 'Error reseting image'
  //     });
  //   }
  // }

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

  console.log('req.query.eliminar_img', req.query.eliminar_img);
  if (req.query.eliminar_img === 'true'){
    console.log('si lees esto, el usuario pidio eliminar la img');
    if (errorDeletingOldImg(empresa.img_src)){
      return res.status(400).send({
        message: 'Error reseting image'
      });
    }else{
      empresa.img_src = Empresa.schema.path('img_src').defaultValue; // reseteamos
    }
  }

  //console.log(req);
  console.log('GUARDO');
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
  errorDeletingOldImg(empresa.img_src);
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
      empresas.forEach(function (empresa) {
        empresa.liked = empresaLikeada(empresa, req.user);
      });
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
  var existingImg = '';
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploads.empresaUpload.dest);
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });
  var upload = multer({ storage: storage,
                        limits: config.uploads.empresaUpload.limits })
                        .single('newEmpresaImage');
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
            //console.log(req.file);
            if (!errorDeletingOldImg(empresa.img_src)) { //si no hubieron errores, guardo
              empresa.img_src = req.file.path;
              empresa.save();
              res.json({ message: 'Changes in empresa.img_src done succesfully!' });
            }else{
              res.status(400).send({
                message: 'Error updating empresa.img_src'
              });
            }
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

/**
 * Indica si la empresa tiene un like basándose en el google_id
 *
 * @param empresa
 * @param user
 * @returns {boolean}
 */
function empresaLikeada(empresa, user) {
  return user.empresasLikeadas.indexOf(empresa.google_id) >= 0;
}


/**
* Intenta eliminar la imagen anterior asociada a la empresa.
* Retorna true si hubieron errores o false, si todo salio bien.
*
* @param existingImg
* @returns {boolean}
*/
function errorDeletingOldImg(existingImg) {
  console.log('in errorDeletingOldImg: ', existingImg);
  if (existingImg !== Empresa.schema.path('img_src').defaultValue) { //Solo eliminamos anterior si no es la default
    fs.unlink(existingImg, function (unlinkError) {
      if (unlinkError) { // si hubo error al eliminar img
        //console.log('in errorDeletingOldImg -> unlinkError');
        return true;
      } else { // pudimos eliminar img anterior, asociamos la nueva
        return false;
      }
    });
  }
}
