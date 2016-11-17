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
        result.img_src = 'http://www.creatuestilo.com/wp-content/themes/tempest/images/no.image.50x50.png';
      }
      return result;
    };

    $scope.search = function(){
      var latlng = String(window.position.coords.latitude) +','+ String(window.position.coords.longitude);
      var filter = $scope.selected_filter;
      //bsas: '-34.6131500,-58.3772300'
      $http({
        method: 'POST',
        url: '/search_term',
        data: {
          name: $scope.search_term,
          location: latlng,
          radius: 2000,
          types: (filter !== 'all') ? filter : ''
        }
      }).then(function successCallback(response) {
        console.log('success!', response.data.results);
        $scope.search_results = response.data.results.map($scope.get_image);
      }, function errorCallback(response) {
        console.log('error!');
      });
    };

    $scope.set_filter = function (filter) {
      $scope.selected_filter = $scope.get_filter_types(filter);
      $('.material-icons').removeClass('active');
      $('.material-icons#'+filter).addClass('active');
      var placeholder = 'Buscar en ';
      var categoria = $('.material-icons#'+filter).attr('alt');
      $('.search-input').attr('placeholder', placeholder+categoria);
    };

    $scope.item_clicked = function (item_index) {
      var place = $scope.search_results[item_index];
      var lat = place.geometry.location.lat;
      var lng = place.geometry.location.lng;
      var position = {lat: lat, lng: lng};
      console.log('putting a marker for '+place.name+' in '+lat+','+lng);
      uiGmapGoogleMapApi.then(function(maps) {
        console.log($('#map'), position);
        var map = new maps.Map(document.getElementById('map'), {
          center: position ,
          scrollwheel: false,
          zoom: 18
        });
        var marker = new maps.Marker({
          position: position,
          map: map,
          title: place.name
        });
      });

    };

    $scope.get_filter_types = function (filter) {
      var filter_types = {
        'store': 'store|bicycle_store|book_store|cafe|clothing_store|convenience_store|department_store|electronics_store|florist|furniture_store|grocery_or_supermarket|hair_care|hardware_store|home_goods_store|jewelry_store|laundry|liquor_store|locksmith|night_club|pet_store|pharmacy|post_office|shoe_store|shopping_mall|veterinary_care',
        'car': 'airport|bus_station|car_dealer|car_rental|car_repair|car_wash|parking|rv_park|subway_station|taxi_stand|train_station|travel_agency',
        'hotel': 'campground|lodging',
        'food': 'casino|food|grocery_or_supermarket|liquor_store|meal_delivery|meal_takeaway|night_club|shopping_mall',
        'gas_station': 'gas_station',
        'health': 'dentist|doctor|fire_station|funeral_home|health|hospital|police|pharmacy|physiotherapist|veterinary_care',
        'religion': 'church|hindu_temple|mosque|place_of_worship|synagogue',
        'repair': 'electrician|general_contractor|lawyer|locksmith|painter|plumber|roofing_contractor'
      };

      if (filter !== 'all')
        return filter_types[filter];
      else
        return Object.values(filter_types).join('|');
    };

    $scope.set_filter('all');
  }
]);
