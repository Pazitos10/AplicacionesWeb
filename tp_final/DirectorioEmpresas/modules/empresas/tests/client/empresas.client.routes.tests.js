(function () {
  'use strict';

  describe('Empresas Route Tests', function () {
    // Initialize global variables
    var $scope,
      EmpresasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EmpresasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EmpresasService = _EmpresasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('empresas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/empresas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EmpresasController,
          mockEmpresa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('empresas.view');
          $templateCache.put('modules/empresas/client/views/view-empresa.client.view.html', '');

          // create mock Empresa
          mockEmpresa = new EmpresasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Empresa Name'
          });

          // Initialize Controller
          EmpresasController = $controller('EmpresasController as vm', {
            $scope: $scope,
            empresaResolve: mockEmpresa
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:empresaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.empresaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            empresaId: 1
          })).toEqual('/empresas/1');
        }));

        it('should attach an Empresa to the controller scope', function () {
          expect($scope.vm.empresa._id).toBe(mockEmpresa._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/empresas/client/views/view-empresa.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EmpresasController,
          mockEmpresa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('empresas.create');
          $templateCache.put('modules/empresas/client/views/form-empresa.client.view.html', '');

          // create mock Empresa
          mockEmpresa = new EmpresasService();

          // Initialize Controller
          EmpresasController = $controller('EmpresasController as vm', {
            $scope: $scope,
            empresaResolve: mockEmpresa
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.empresaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/empresas/create');
        }));

        it('should attach an Empresa to the controller scope', function () {
          expect($scope.vm.empresa._id).toBe(mockEmpresa._id);
          expect($scope.vm.empresa._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/empresas/client/views/form-empresa.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EmpresasController,
          mockEmpresa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('empresas.edit');
          $templateCache.put('modules/empresas/client/views/form-empresa.client.view.html', '');

          // create mock Empresa
          mockEmpresa = new EmpresasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Empresa Name'
          });

          // Initialize Controller
          EmpresasController = $controller('EmpresasController as vm', {
            $scope: $scope,
            empresaResolve: mockEmpresa
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:empresaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.empresaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            empresaId: 1
          })).toEqual('/empresas/1/edit');
        }));

        it('should attach an Empresa to the controller scope', function () {
          expect($scope.vm.empresa._id).toBe(mockEmpresa._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/empresas/client/views/form-empresa.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
