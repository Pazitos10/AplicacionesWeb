(function () {
  'use strict';

  angular
    .module('categorias')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items

    menuService.addMenuItem('topbar', {
      title: 'Categorias',
      state: 'categorias',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'categorias', {
      title: 'Listar Categorias',
      state: 'categorias.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'categorias', {
      title: 'Crear Categoria',
      state: 'categorias.create',
      roles: ['user']
    });
  }
}());
