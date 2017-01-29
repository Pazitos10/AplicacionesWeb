(function () {
  'use strict';

  // Empresas controller
  angular
    .module('empresas')
    .controller('EmpresasController', EmpresasController);

  EmpresasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'empresaResolve'];

  function EmpresasController($scope, $state, $window, Authentication, empresa) {
    var vm = this;

    vm.authentication = Authentication;
    vm.empresa = empresa;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Empresa
    function remove() {
      if ($window.confirm('¿Está seguro que desea eliminar esta Empresa?')) {
        vm.empresa.$remove($state.go('empresas.list'));
      }
    }

    // Save Empresa
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.empresaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.empresa._id) {
        vm.empresa.$update(successCallback, errorCallback);
      } else {
        vm.empresa.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('empresas.view', {
          empresaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
