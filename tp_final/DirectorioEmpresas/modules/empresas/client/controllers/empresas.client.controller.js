(function () {
  'use strict';

  // Empresas controller
  angular
    .module('empresas')
    .controller('EmpresasController', EmpresasController);

  EmpresasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'empresaResolve', 'uiGmapGoogleMapApi',
    'CategoriasService'];

  function EmpresasController($scope, $state, $window, Authentication, empresa, uiGmapApi, CategoriasService) {
    var vm = this;

    vm.getPreviousDayData = getPreviousDayData;
    vm.getNextDayData = getNextDayData;
    vm.remove = remove;
    vm.save = save;
    vm.searchByAddress = searchByAddress;
    vm.categorias = CategoriasService.query();
    vm.authentication = Authentication;
    vm.empresa = empresa;
    vm.error = null;
    vm.form = {};
    vm.map = {};
    vm.markers = [];
    vm.userPosition = {};
    vm.weekdays_names = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var BlankDayTemplate = function () {
      this.day = vm.weekdays_names[0];
      this.periods = [{ 'from': '', 'to': '' }, { 'from': '', 'to': '' }];
    };
    vm.initOpeningHours = initOpeningHours;



    vm.initOpeningHours();
    vm.current_day = vm.empresa.opening_hours[0];

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

    function removeMarkers(){
      vm.markers.map(function (marker){
        marker.setMap(null);
      });
    }

    function createMarker(position) {
      uiGmapApi.then(function(maps) {
        removeMarkers();
        vm.markers.push(new maps.Marker({ position: position, map: vm.map }));
      });
    }

    function searchByAddress() {
      uiGmapApi.then(function(maps) {
        new maps.Geocoder().geocode({ 'address': vm.empresa.domicilio }, function(results, status) {
          if (status === maps.GeocoderStatus.OK) {
            //callback(results[0].geometry.location);
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

    function obtenerUbicacion() {
      var geo = navigator.geolocation;
      if (geo)
        geo.getCurrentPosition(initMap, $scope.verificarError);
      else
        $('#map').innerHTML = 'Geolocation is not supported by this browser.';
    }

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

    /**
      Slider: obtiene los datos del siguiente dia
    */
    function getNextDayData(){
      var current_day_name = vm.current_day.day;
      var current_day_name_index = vm.weekdays_names.indexOf(current_day_name);
      updateOpeningHoursForCurrentDay(current_day_name, current_day_name_index);
      if (current_day_name_index < vm.weekdays_names.length - 1)
        updateCurrentDay(current_day_name_index + 1);
      if (current_day_name_index === vm.weekdays_names.length - 1)
        updateCurrentDay(0);
    }

    /**
      Slider: obtiene los datos del dia anterior
    */
    function getPreviousDayData(){
      var current_day_name = vm.current_day.day;
      var current_day_name_index = vm.weekdays_names.indexOf(current_day_name);
      updateOpeningHoursForCurrentDay(current_day_name, current_day_name_index);
      if (current_day_name_index === 0)
        updateCurrentDay(vm.weekdays_names.length - 1);
      if (current_day_name_index > 0)
        updateCurrentDay(current_day_name_index - 1);
    }

    function updateCurrentDay(index){
      vm.current_day = Object.assign({}, vm.empresa.opening_hours[index]);
    }


    /* Actualiza los datos de horarios en la estructura de la empresa */
    function updateOpeningHoursForCurrentDay(new_day_name, index){
      var current_day_copy = Object.assign({}, vm.current_day);
      if (vm.empresa.opening_hours[index]) {
        vm.empresa.opening_hours[index] = current_day_copy; //actualizo
      }
    }

    /* Inicializa la estructura de datos para la empresa, si ya no la tenia creada */
    function initOpeningHours() {
      if (!vm.empresa.opening_hours){
        vm.empresa.opening_hours = [];
        for (var i = 0; i < vm.weekdays_names.length; i++){
          var opening_hour = new BlankDayTemplate();
          opening_hour.day = vm.weekdays_names[i];
          vm.empresa.opening_hours.push(opening_hour);
        }
      }
    }

    obtenerUbicacion();

  }
}());
