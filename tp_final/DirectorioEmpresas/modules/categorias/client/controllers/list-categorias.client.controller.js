(function () {
  'use strict';

  angular
    .module('categorias')
    .controller('CategoriasListController', CategoriasListController);

  CategoriasListController.$inject = ['CategoriasService', 'Authentication'];

  function CategoriasListController(CategoriasService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.categorias = CategoriasService.query();
  }
}());
