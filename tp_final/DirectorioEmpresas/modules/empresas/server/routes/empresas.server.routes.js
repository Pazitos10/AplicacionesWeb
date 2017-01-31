'use strict';

/**
 * Module dependencies
 */
var empresasPolicy = require('../policies/empresas.server.policy'),
  empresas = require('../controllers/empresas.server.controller');

module.exports = function (app) {
  // Empresas Routes
  app.route('/api/empresas').all(empresasPolicy.isAllowed)
    .get(empresas.list)
    .post(empresas.create);

  app.route('/api/empresas/importar').all(empresasPolicy.isAllowed)
    .post(empresas.importar);

  app.route('/api/empresas/vote').all(empresasPolicy.isAllowed)
    .post(empresas.vote);

  app.route('/api/empresas/:empresaId').all(empresasPolicy.isAllowed)
    .get(empresas.read)
    .put(empresas.update)
    .delete(empresas.delete);

  // Finish by binding the Empresa middleware
  app.param('empresaId', empresas.empresaByID);
};
