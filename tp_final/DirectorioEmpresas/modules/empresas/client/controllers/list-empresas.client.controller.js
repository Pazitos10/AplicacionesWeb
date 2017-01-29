(function () {
  'use strict';

  angular
    .module('empresas')
    .controller('EmpresasListController', EmpresasListController);

  EmpresasListController.$inject = ['EmpresasService', 'Authentication'];

  function EmpresasListController(EmpresasService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.empresas = EmpresasService.query();

  }
}());
