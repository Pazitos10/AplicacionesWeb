// Empresas service used to communicate Empresas REST endpoints
(function () {
  'use strict';

  angular
    .module('empresas')
    .factory('EmpresasService', EmpresasService);

  EmpresasService.$inject = ['$resource'];

  function EmpresasService($resource) {
    return $resource('api/empresas/:empresaId', {
      empresaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
