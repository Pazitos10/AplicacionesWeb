(function () {
  'use strict';

  angular
    .module('empresas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Empresas',
      state: 'empresas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'empresas', {
      title: 'List Empresas',
      state: 'empresas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'empresas', {
      title: 'Create Empresa',
      state: 'empresas.create',
      roles: ['user']
    });
  }
}());
