(function () {
  'use strict';

  describe('Categorias Controller Tests', function () {
    // Initialize global variables
    var CategoriasController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CategoriasService,
      mockCategoria;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CategoriasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CategoriasService = _CategoriasService_;

      // create mock Categoria
      mockCategoria = new CategoriasService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Categoria Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Categorias controller.
      CategoriasController = $controller('CategoriasController as vm', {
        $scope: $scope,
        categoriaResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCategoriaPostData;

      beforeEach(function () {
        // Create a sample Categoria object
        sampleCategoriaPostData = new CategoriasService({
          name: 'Categoria Name'
        });

        $scope.vm.categoria = sampleCategoriaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CategoriasService) {
        // Set POST response
        $httpBackend.expectPOST('api/categorias', sampleCategoriaPostData).respond(mockCategoria);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Categoria was created
        expect($state.go).toHaveBeenCalledWith('categorias.view', {
          categoriaId: mockCategoria._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/categorias', sampleCategoriaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Categoria in $scope
        $scope.vm.categoria = mockCategoria;
      });

      it('should update a valid Categoria', inject(function (CategoriasService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/categorias\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('categorias.view', {
          categoriaId: mockCategoria._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CategoriasService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/categorias\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Categorias
        $scope.vm.categoria = mockCategoria;
      });

      it('should delete the Categoria and redirect to Categorias', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/categorias\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('categorias.list');
      });

      it('should should not delete the Categoria and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
