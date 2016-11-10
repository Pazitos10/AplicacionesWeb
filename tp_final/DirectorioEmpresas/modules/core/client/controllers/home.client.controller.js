'use strict';

angular.module('core')
.controller('HomeController', ['$http', '$scope', 'Authentication', 'uiGmapGoogleMapApi',
  function ($http, $scope, Authentication, uiGmapGoogleMapApi) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.search_term = '';
    $scope.search_results = [];
    $scope.selected_filter = 'all';
    $scope.get_image = function(result){
      if (result.photos) {
        $http({
          method: 'POST',
          url: '/search_img',
          data: {
            photoreference: result.photos[0].photo_reference,
          }
        }).then(function (response){
          result.img_src = response.data.src;
        }, function(response){
          console.log('hubo un error al solicitar la imagen');
        });
      }else{
        result.img_src = 'http://placehold.it/50/50';
      }
      return result;
    };

    $scope.search = function(){
      var latlng = String(window.position.coords.latitude) +','+ String(window.position.coords.longitude);
      console.log(latlng);
      //bsas: '-34.6131500,-58.3772300'
      $http({
        method: 'POST',
        url: '/search_term',
        data: {
          name: $scope.search_term,
          location: latlng,
          radius: 500,
          types: 'food'
        }
      }).then(function successCallback(response) {
        console.log('success!', response.data.results);
        $scope.search_results = response.data.results.map($scope.get_image);
      }, function errorCallback(response) {
        console.log('error!', response.data);
      });
    };

    $scope.geocodeLocation = function () {
      uiGmapGoogleMapApi.then(function(maps) {
        console.log(maps);
        //var address = document.getElementById('address').value;
        var address = '9 de Julio 25, Trelew Chubut';
        var geocoder = new maps.Geocoder();
        geocoder.geocode({ 'address': address }, function(results, status) {
          if (status === maps.GeocoderStatus.OK) {
            console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      });
    };

    $scope.set_filter = function (filter) {
      $scope.selected_filter = filter;
      $('.material-icons').removeClass('active');
      $('.material-icons#'+filter).addClass('active');
      var placeholder = 'Buscar en ';
      var categoria = $('.material-icons#'+filter).attr('alt');
      $('.search-input').attr('placeholder', placeholder+categoria);
    };

    $scope.set_filter('all');
  }
]);
