'use strict';

angular.module('core').controller('HomeController', ['$http', '$scope', 'Authentication',
  function ($http, $scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.search_term = '';
    $scope.search_results = [];
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
      }{
        result.img_src = 'http://placehold.it/50/50';
      }
      return result;
    };

    $scope.search = function(){
      $http({
        method: 'POST',
        url: '/search_term',
        data: {
          name: $scope.search_term,
          location: '-34.6131500,-58.3772300',
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

  }
]);