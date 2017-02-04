(function () {
  'use strict';

  angular
    .module('empresas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('empresas', {
        abstract: true,
        url: '/empresas',
        template: '<ui-view/>'
      })
      .state('empresas.list', {
        url: '',
        templateUrl: 'modules/empresas/client/views/list-empresas.client.view.html',
        controller: 'EmpresasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Empresas List'
        }
      })
      .state('empresas.create', {
        url: '/create',
        templateUrl: 'modules/empresas/client/views/form-empresa.client.view.html',
        controller: 'EmpresasController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: newEmpresa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Empresas Create'
        }
      })
      .state('empresas.edit', {
        url: '/:empresaId/edit',
        templateUrl: 'modules/empresas/client/views/form-empresa.client.view.html',
        controller: 'EmpresasController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: getEmpresa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Empresa {{ empresaResolve.name }}'
        }
      })
      .state('empresas.view', {
        url: '/:empresaId',
        templateUrl: 'modules/empresas/client/views/view-empresa.client.view.html',
        controller: 'EmpresasController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: getEmpresa
        },
        data: {
          pageTitle: 'Empresa {{ empresaResolve.name }}'
        }
      });
  }

  getEmpresa.$inject = ['$stateParams', 'EmpresasService'];

  function getEmpresa($stateParams, EmpresasService) {
    return EmpresasService.get({
      empresaId: $stateParams.empresaId
    }).$promise;
  }

  newEmpresa.$inject = ['EmpresasService'];

  function newEmpresa(EmpresasService) {
    return new EmpresasService();
  }
}());
