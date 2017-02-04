(function () {
  'use strict';

  // Empresas controller
  angular
    .module('empresas')
    .controller('EmpresasController', EmpresasController);

  EmpresasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'empresaResolve', 'uiGmapGoogleMapApi', 'FileUploader', '$timeout'];

  function EmpresasController($scope, $state, $window, Authentication, empresa, uiGmapApi, FileUploader, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.empresa = empresa;
    vm.error = null;
    vm.form = {};
    vm.map = {};
    vm.remove = remove;
    vm.save = save;
    vm.searchByAddress = searchByAddress;
    vm.markers = [];
    vm.userPosition = {};

    /* Creamos una instancia del uploader */
    vm.uploader = new FileUploader({
      url: 'api/empresas/saveImage',
      alias: 'newEmpresaImage'
    });

    // Configuramos el filtro de imagenes
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Se llama despues de que el usuario selecciono una imagen
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.empresa.img_src = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Se llama antes de subir la img al servidor
    vm.uploader.onBeforeUploadItem = function(item) {
      //inyectamos id de empresa para poder asociar la img a la empresa indicada
      item.formData.push({ empresa_id: vm.empresa._id });
    };

    // Callback despues que el usuario subio con exito una img al servidor
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      vm.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      vm.cancelUpload();
      vm.error = response.message;
    };

    // Cancela el proceso de subida
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();
    };

    /* Inicializa y muestra el mapa en pantalla */
    function initMap (position) {
      $scope.position = position;
      var lat = $scope.position.coords.latitude;
      var lng = $scope.position.coords.longitude;
      var center = { lat: lat, lng: lng };
      vm.userPosition = center;
      var opt = { scrollwheel: false, zoom: 15, center: center };
      if ($('#map')[0]) {
        uiGmapApi.then(function(maps) {
          vm.map = new maps.Map($('#map')[0], opt);
        });
        $('#map').removeClass('location-disabled');
      }
    }

    /* Elimina los marcadores del mapa */
    function removeMarkers(){
      vm.markers.map(function (marker){
        marker.setMap(null);
      });
    }

    /* Crea un nuevo marcador en la posicion indicada */
    function createMarker(position) {
      uiGmapApi.then(function(maps) {
        removeMarkers();
        vm.markers.push(new maps.Marker({ position: position, map: vm.map }));
      });
    }

    /* Busca datos latitud/longitud en base a la direccion ingresada en el formulario */
    function searchByAddress() {
      uiGmapApi.then(function(maps) {
        new maps.Geocoder().geocode({ 'address': vm.empresa.domicilio }, function(results, status) {
          if (status === maps.GeocoderStatus.OK) {
            var location = results[0].geometry.location;
            var position = { lat: location.lat(), lng: location.lng() };
            vm.empresa.location = [position.lat, position.lng];
            createMarker(position);
            vm.map.setCenter(position);
          } else {
            removeMarkers();
            vm.map.setCenter(vm.userPosition);
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      });
    }

    /* Obtiene la posicion del usuario en base a el navegador */
    function obtenerUbicacion() {
      var geo = navigator.geolocation;
      if (geo)
        geo.getCurrentPosition(initMap, $scope.verificarError);
      else
        $('#map').innerHTML = 'Geolocation is not supported by this browser.';
    }

    // Elimina la empresa existente
    function remove() {
      if ($window.confirm('¿Está seguro que desea eliminar esta Empresa?')) {
        vm.empresa.$remove($state.go('empresas.list'));
      }
    }

    // Guarda los datos de la empresa
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.empresaForm');
        return false;
      }

      if (vm.empresa._id) {
        vm.empresa.$update(successCallback, errorCallback);
      } else {
        vm.empresa.$save(successCallback, errorCallback);
      }

      /* Luego de guardar exitosamente, subimos las img al servidor */
      function successCallback(res) {
        // Asociamos el id obtenido a la empresa del scope para ser utilizado en beforeUploadItem
        vm.empresa._id = res._id;
        vm.uploader.uploadAll();
        $state.go('empresas.view', {
          empresaId: res._id
        });
      }

      // Si ocurriera un error al guardar los datos se ejecuta lo siguiente
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    obtenerUbicacion();

  }
}());
