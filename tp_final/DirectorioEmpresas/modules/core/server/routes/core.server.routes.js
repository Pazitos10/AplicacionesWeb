'use strict';
var GooglePlaces = require('googleplaces');
var translate = require('google-translate-api');
var config = require('../../../../config/env/development.js');
var googleplaces = new GooglePlaces(config.googlePlaces.apiKey,
                                    config.googlePlaces.outputFormat);
var mongoose = require('mongoose');
var Empresa = mongoose.model('Empresa');

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  var procesar_datos_locales = function (resultados, index){
    var aux = [];
    resultados.forEach(function (resultado){
      Empresa.findOne({ 'razonSocial': resultado.name }, function(err, result_db){
        if (result_db !== null) {
          aux[index] = result_db;
        }else{
          aux[index] = resultados[index];
        };
      });
    });
    return aux; //WIP: aun no funciona - problemas con scope de variables
  };
  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  app.route('/search_term').post(function(req, res, next) {
    googleplaces.nearBySearch(req.body, function (error, response) {
      if (error){
        console.log('ERROR:', error);
        return res.json({ 'results': [] });
      }
      //procesar_datos_locales(response.results);
      return res.json({ 'results': response.results });
    });
  });

  app.route('/search_details').post(function (req, res, next) {
    googleplaces.placeDetailsRequest({ reference: req.body.reference } ,function(error, response){
      if (error) console.error(error);
      return res.json({ 'details': response });
    });
  });

  app.route('/search_img').post(function (req, res, next) {
    var photoreference = req.body.photoreference;
    googleplaces.imageFetch({ photoreference: photoreference },
      function(error, response) {
        return res.json({ 'src': response });
      }
    );
  });

  app.route('/translate').post(function (req, res, next) {
    var term = req.body.term;
    translate(term, { from:'en', to: 'es' }).then(function (result) {
      return res.json({ 'result_text': result.text });
    }).catch(function (err) {
      console.error(err);
      return res.json({ 'result_text': '' });
    });
  });
};
