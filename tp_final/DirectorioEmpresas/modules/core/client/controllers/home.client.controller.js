'use strict';

angular.module('core')
.controller('HomeController', ['$http', '$scope', 'Authentication', 'uiGmapGoogleMapApi',
  function ($http, $scope, Authentication, uiGmapGoogleMapApi) {
    //Inicializamos variables
    $scope.authentication = Authentication; // provee el contexto de Autenticacion.
    $scope.search_term = '';
    $scope.search_results = [];
    $scope.selected_filter = 'all';
    $scope.no_results_msg = 'Elegí la categoría y encontra el lugar que estas buscando';
    $scope.horarios = [];

    /*
      Busca una imagen para un lugar y se la agrega a sus propiedades.
      Devuelve el lugar modificado
    */
    $scope.get_image = function(place){
      if (place.photos) {
        $http({
          method: 'POST',
          url: '/search_img',
          data: {
            photoreference: place.photos[0].photo_reference,
          }
        }).then(function (response){
          place.img_src = response.data.src;
        }, function(response){
          console.log('get_image(): Error al solicitar la imagen.');
        });
      }else{
        place.img_src = 'http://www.creatuestilo.com/wp-content/themes/tempest/images/no.image.50x50.png';
      }
      return place;
    };

    /*
      Busca informacion basica para un lugar
    */
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
        if(response.data.results.length <= 0)
          $scope.no_results_msg = 'No se encontraron resultados :(';
        $scope.search_results = response.data.results.map($scope.get_image);
      }, function errorCallback(response) {
        console.log('search(): Error al realizar la busqueda.');
      });
    };

    /* Configura el filtro (categoria) a utilizar para la busqueda */
    $scope.set_filter = function (filter) {
      $scope.selected_filter = $scope.get_filter_types(filter);
      $('.material-icons').removeClass('active');
      $('.material-icons#'+filter).addClass('active');
      var placeholder = 'Buscar en ';
      var categoria = $('.material-icons#'+filter).attr('alt');
      $('.search-input').attr('placeholder', placeholder+categoria);
    };

    /*
      Identifica cuando un item de la lista de resultados es seleccionado,
      pone un marcador en el mapa en las coordenadas del lugar y
      muestra informacion detallada del mismo.
    */
    $scope.item_clicked = function (item_index) {
      var place = $scope.search_results[item_index];
      var lat = place.geometry.location.lat;
      var lng = place.geometry.location.lng;
      var position = { lat: lat, lng: lng };
      uiGmapGoogleMapApi.then(function(maps) {
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
      $scope.show_detail(place);
    };

    /*
      Obtiene las keywords necesarias para buscar un lugar de acuerdo a una categoria.
    */
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

    /*
      Activa/Muestra el resumen detallado del lugar.
    */
    $scope.show_detail = function (place){
      $('.result-detail').removeClass('invisible');
      $('.search-form-wrapper').addClass('invisible');
      $scope.search_details(place);
    };

    /*
      Desactiva/Oculta el resumen detallado del lugar.
    */
    $scope.hide_detail = function () {
      $('.result-detail').addClass('invisible');
      $('.search-form-wrapper').removeClass('invisible');
    };

    /*
      Traduce los tipos/categorias a los cuales esta asociado un lugar.
    */
    $scope.translate_types = function (place) {
      //traduce solo los tipos
      place.tipos = [];
      place.types.map(function (type){
        $http({
          method: 'POST',
          url: '/translate',
          data: {
            term: type
          }
        }).then(function successCallback(response) {
          place.tipos.push(response.data.result_text);
          $('#tipos')[0].innerHTML = place.tipos.join(', ');
        }, function errorCallback(response) {
          console.log('translate_types(): Error al obtener traducciones.');
        });
      });
    };

    /*
      Busca informacion detallada de un lugar y la muestra en pantalla.
    */
    $scope.search_details = function (place) {
      $http({
        method: 'POST',
        url: '/search_details',
        data: {
          reference: place.reference
        }
      }).then(function successCallback(response) {
        place.details = response.data.details.result;
        //console.log(place);
        $('#name')[0].innerHTML = place.name;
        $('#direccion')[0].innerHTML = place.formatted_address || place.vicinity || 'Dirección no disponible';
        $('#url')[0].href = place.website || '#';
        $('#url')[0].innerHTML = place.website || 'Sitio web no disponible';
        $('#telefono')[0].innerHTML = place.formatted_phone_number || 'No disponible';
        $('#horarios')[0].innerHTML = $scope.get_estado(place);
        if(place.rating){
          $('#rating-label').show();
          $('#rating')[0].innerHTML = place.rating;
        }else
          $('#rating-label').hide();
        $scope.translate_types(place);
        place = $scope.get_image(place);
        $('.result-detail-img').css('background', 'url(' + place.img_src + ') no-repeat center center rgba(0,0,0,.2)');
        $('.result-detail-img-link')[0].href = place.img_src;
      }, function errorCallback(response) {
        console.log('search_details(): Error al obtener detalles.');
      });
    };

    /* Obtiene el estado de un lugar/organizacion: Abierto, Cerrado o No disponible. */
    $scope.get_estado = function (place) {
      if (place.opening_hours){
        $('.show-horarios-btn').show();
        $scope.set_dias_y_horarios(place.details.opening_hours.weekday_text);
        return (place.opening_hours.open_now) ? 'Abierto': 'Cerrado';
      }else{
        $('.show-horarios-btn').hide();
        return 'No disponible';
      }
    };

    /*
      Setea los dias y horarios de atencion de un lugar y lo muestra en pantalla.
    */
    $scope.set_dias_y_horarios = function (weekday_text) {
      $('.horarios-body').empty();
      weekday_text.map(function (value){
        $http({
          method: 'POST',
          url: '/translate',
          data: {
            term: value
          }
        }).then(function successCallback(response) {
          var horario = response.data.result_text;
          $('.horarios-body').append('<tr><td>'+horario+'</td></tr>');
        }, function errorCallback(response) {
          console.log('set_dias_y_horarios(): Error al obtener traducciones.');
        });
      });
    };

    /*
      Muestra/Oculta detalles de horarios semanales en la informacion del lugar.
    */
    $scope.toggle_horarios = function () {
      $('.horarios-info').toggleClass('invisible');
      var arrow = $('.show-horarios-btn .material-icons')[0].innerHTML;
      if (arrow === 'keyboard_arrow_down')
        $('.show-horarios-btn .material-icons')[0].innerHTML = 'keyboard_arrow_up';
      else
        $('.show-horarios-btn .material-icons')[0].innerHTML = 'keyboard_arrow_down';

    };

    $scope.set_filter('all'); //Seteamos el filtro inicial a 'Todos'
  }
]);
