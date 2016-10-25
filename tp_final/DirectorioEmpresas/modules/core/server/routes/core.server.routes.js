'use strict';
var GooglePlaces = require('googleplaces');
var config = require('../../../../config/env/development.js');
var googleplaces = new GooglePlaces(config.googlePlaces.apiKey, config.googlePlaces.outputFormat);

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  app.route('/search_term').post(function(req, res, next) {
    console.log(googleplaces);
    googleplaces.nearBySearch(req.body, function (error, response) {
      if (error) return res.json({ 'error': error, 'results': [] });
      return res.json({ 'results': response.results });
    });
  });

  app.route('/search_img').post(function (req, res, next) {
    var photoreference = req.body.photoreference;
    console.log('photoreference', photoreference);
    googleplaces.imageFetch({ photoreference: photoreference }, 
      function(error, response) {
        return res.json({ 'src': response });
      }
    );
  });
};
