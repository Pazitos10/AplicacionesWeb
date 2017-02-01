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
  var getEmpresas = function(filtro) {
    var condicion = filtro ? { 'razonSocial': new RegExp(filtro,'i') } : {};
    return Empresa.find(condicion);
  };

  /*
  * Convierte un numero decimal a radianes
  */
  var dec2Rad = function(decimal){
    return Number(decimal) * Math.PI / 180;
  };

  /*
  * Calcula la distancia entre 2 puntos de la tierra (en metros)
  * usando latitud y longitud de ambos puntos con la formula de haversine.
  */
  var distance_haversine = function(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // radio aprox. de la tierra en metros
    var lat1_rad = dec2Rad(lat1);
    var lat2_rad = dec2Rad(lat2);
    var delta_lat_rad = dec2Rad(lat2-lat1);
    var delta_lon_rad = dec2Rad(lon2-lon1);
    var a = Math.sin(delta_lat_rad/2) * Math.sin(delta_lat_rad/2) +
          Math.cos(lat1_rad) * Math.cos(lat2_rad) *
          Math.sin(delta_lon_rad/2) * Math.sin(delta_lon_rad/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  };

  var nearBySearch = function (data){
    //TODO: cuando tengamos categorias, filtrar por categorias en terminos de busqueda tambien.
    console.log('en nearBySearch');
    var name = data.name;
    var lat = data.location.split('\,')[0];
    var lng = data.location.split('\,')[1];
    var radius = data.radius;
    var filtro = (name.length > 0) ? { 'razonSocial': data.name } : {};
    var promise = getEmpresas().exec().then(function(empresas_db){
      var results = [];
      if (empresas_db !== null) {
        for (var i = 0; i < empresas_db.length; i++){
          var lat_db = Number(empresas_db[i].location[0]);
          var lng_db = Number(empresas_db[i].location[1]);
          if (distance_haversine(lat_db, lng_db , lat, lng) < radius) { // La empresa esta en el radio adecuado
            results.push(empresas_db[i]);
          }
        }
      }
      return results;
    });
    return promise;
  };
  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  app.route('/search_term').post(function(req, res, next) {
    console.log('en /search_term');
    googleplaces.nearBySearch(req.body, function (error, response) {
      if (error){
        console.log('ERROR:', error);
        return res.json({ 'results': [] });
      }
      nearBySearch(req.body).then(function(local_results){
        console.log('locales', local_results);
        return res.json({ 'results': response.results.concat(local_results) });
      });
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
