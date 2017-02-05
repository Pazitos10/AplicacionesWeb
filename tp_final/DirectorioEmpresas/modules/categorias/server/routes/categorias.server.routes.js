'use strict';

/**
 * Module dependencies
 */
var categoriasPolicy = require('../policies/categorias.server.policy'),
  categorias = require('../controllers/categorias.server.controller');

module.exports = function(app) {
  // Categorias Routes
  app.route('/api/categorias').all(categoriasPolicy.isAllowed)
    .get(categorias.list)
    .post(categorias.create);

  app.route('/api/categorias/:categoriaId').all(categoriasPolicy.isAllowed)
    .get(categorias.read)
    .put(categorias.update)
    .delete(categorias.delete);

  // Finish by binding the Categoria middleware
  app.param('categoriaId', categorias.categoriaByID);
};
