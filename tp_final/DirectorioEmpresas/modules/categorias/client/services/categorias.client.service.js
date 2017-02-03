// Categorias service used to communicate Categorias REST endpoints
(function () {
  'use strict';

  angular
    .module('categorias')
    .factory('CategoriasService', CategoriasService);

  CategoriasService.$inject = ['$resource'];

  function CategoriasService($resource) {
    return $resource('api/categorias/:categoriaId', {
      categoriaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
