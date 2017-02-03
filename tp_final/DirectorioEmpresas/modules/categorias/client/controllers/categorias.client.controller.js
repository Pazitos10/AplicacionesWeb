(function () {
  'use strict';

  // Categorias controller
  angular
    .module('categorias')
    .controller('CategoriasController', CategoriasController);

  CategoriasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categoriaResolve'];

  function CategoriasController ($scope, $state, $window, Authentication, categoria) {
    var vm = this;

    vm.authentication = Authentication;
    vm.categoria = categoria;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Categoria
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.categoria.$remove($state.go('categorias.list'));
      }
    }

    // Save Categoria
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoriaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.categoria._id) {
        vm.categoria.$update(successCallback, errorCallback);
      } else {
        vm.categoria.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('categorias.view', {
          categoriaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
