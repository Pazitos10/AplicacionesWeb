(function () {
  'use strict';

  angular
    .module('empresas')
    .controller('EmpresasListController', EmpresasListController);

  EmpresasListController.$inject = ['EmpresasService'];

  function EmpresasListController(EmpresasService) {
    var vm = this;
    //vm.empresas = EmpresasService.query();
    vm.empresas = EmpresasService.query();
  }
}());
