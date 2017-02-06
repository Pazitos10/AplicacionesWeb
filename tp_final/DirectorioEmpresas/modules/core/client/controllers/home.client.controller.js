'use strict';

angular.module('core')
.controller('HomeController', ['$http', '$scope', 'Authentication',
  'uiGmapGoogleMapApi', 'moment', function ($http, $scope, Authentication, uiGmapApi, moment) {
    /** Inicializamos variables */
    $scope.authentication = Authentication; // provee el ctx de Autenticacion.
    $scope.search_term = '';
    $scope.search_results = [];
    $scope.selected_filter = 'all';
    $scope.horarios = [];
    $scope.position = {};
    $scope.result_detail = {};
    $scope.search_radius = 500;
    $scope.search_radius_text = '500m';
    $scope.no_results_msg = 'Elegí una categoría'+
                            ' y encontra el lugar que estas buscando';
    /**
      Busca una imagen para un lugar y se la agrega a sus propiedades.
      Devuelve el lugar modificado
    */
    $scope.getImage = function(place){
      if (place.img_src && place.img_src.length > 0) //ya tenia img - caso: empresas locales
        return place;
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
          console.log('getImage(): Error al solicitar la imagen.');
        });
      }else{
        place.img_src = 'https://goo.gl/XApjyb';
      }
      return place;
    };

    /** Busca informacion basica de un lugar */
    $scope.search = function(){
      var latlng = String($scope.position.coords.latitude) +','+
                    String($scope.position.coords.longitude);
      var filter = $scope.selected_filter;
      $http({
        method: 'POST',
        url: '/search_term',
        data: {
          name: $scope.search_term,
          location: latlng,
          radius: $scope.search_radius,
          types: (filter !== 'all') ? filter : ''
        }
      }).then(function successCallback(response) {
        if(response.data.results.length <= 0)
          $scope.no_results_msg = 'No se encontraron resultados :(';
        $scope.search_results = response.data.results.map($scope.getImage);
      }, function errorCallback(response) {
        console.log('search(): Error al realizar la busqueda.');
      });
    };

    /**
      Actualiza el placeholder del buscador segun las opciones de busqueda elegidas
    */
    $scope.update_search_placeholder = function() {
      var placeholder = 'Buscar en ';
      placeholder += $scope.categoria+' a '+$scope.search_radius_text;
      $('.search-input').attr('placeholder', placeholder);
    };

    /** Configura el filtro (categoria) a utilizar para la busqueda */
    $scope.setFilter = function (filter) {
      $scope.selected_filter = $scope.getFilterTypes(filter);
      $('.material-icons').removeClass('active');
      $('.material-icons#'+filter).addClass('active');
      $scope.categoria = $('.material-icons#'+filter).attr('alt');
      $scope.update_search_placeholder();
    };

    /**
      Identifica cuando un item de la lista de resultados es seleccionado,
      pone un marcador en el mapa en las coordenadas del lugar y
      muestra informacion detallada del mismo.
    */
    $scope.itemClicked = function (item_index) {
      var place = $scope.search_results[item_index];
      var lat, lng;
      if (place.geometry) {
        lat = place.geometry.location.lat;
        lng = place.geometry.location.lng;
      } else {
        lat = place.location[0];
        lng = place.location[1];
      }
      var position = { lat: lat, lng: lng };
      uiGmapApi.then(function(maps) {
        $scope.map.setCenter(position);
        $scope.map.setZoom(18);
        $scope.marker = new maps.Marker({
          position: position,
          map: $scope.map,
          title: place.name
        });
      });
      $scope.showDetail(place);
    };

    /**
      Obtiene las keywords necesarias para buscar un lugar de acuerdo
      a una categoria.
    */
    $scope.getFilterTypes = function (filter) {
      var filter_types = {
        'store': 'store|bicycle_store|book_store|cafe|clothing_store|'+
                'convenience_store|department_store|electronics_store|florist|'+
                'furniture_store|grocery_or_supermarket|hair_care|'+
                'hardware_store|home_goods_store|jewelry_store|laundry|'+
                'liquor_store|locksmith|night_club|pet_store|pharmacy|'+
                'post_office|shoe_store|shopping_mall|veterinary_care',
        'car': 'airport|bus_station|car_dealer|car_rental|car_repair|car_wash|'+
              'parking|rv_park|subway_station|taxi_stand|train_station|'+
              'travel_agency',
        'hotel': 'campground|lodging',
        'food': 'casino|food|grocery_or_supermarket|liquor_store|'+
                'meal_delivery|meal_takeaway|night_club|shopping_mall',
        'gas_station': 'gas_station',
        'health': 'dentist|doctor|fire_station|funeral_home|health|hospital|'+
                  'police|pharmacy|physiotherapist|veterinary_care',
        'religion': 'church|hindu_temple|mosque|place_of_worship|synagogue',
        'repair': 'electrician|general_contractor|lawyer|locksmith|painter|'+
                  'plumber|roofing_contractor'
      };

      if (filter !== 'all')
        return filter_types[filter];
      else
        return Object.values(filter_types).join('|');
    };

    /** Activa/Muestra el resumen detallado del lugar. */
    $scope.showDetail = function (place){
      $('.result-detail').removeClass('invisible');
      $('.search-form-wrapper').addClass('invisible');
      $scope.searchDetails(place);
    };

    /** Desactiva/Oculta el resumen detallado del lugar. */
    $scope.hideDetail = function () {
      $('.result-detail').addClass('invisible');
      $('.search-form-wrapper').removeClass('invisible');
      $scope.marker.setMap(null);
      $scope.update_map_zoom();
      var lat = $scope.position.coords.latitude;
      var lng = $scope.position.coords.longitude;
      var center = { lat: lat, lng: lng };
      $scope.map.setCenter(center);
      $scope.horarios = [];
    };

    /** Traduce los tipos/categorias a los cuales esta asociado un lugar. */
    $scope.translateTypes = function (place) {
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
          $scope.result_detail.tipos = place.tipos.join(', ');
        }, function errorCallback(response) {
          console.log('translateTypes(): Error al obtener traducciones.');
        });
      });
    };

    /**
      Busca informacion detallada de un lugar y la muestra en pantalla.
    */
    $scope.searchDetails = function (place) {
      if (place.geometry){
        $http({
          method: 'POST',
          url: '/search_details',
          data: {
            reference: place.reference
          }
        }).then(function successCallback(response) {
          place.details = response.data.details.result;
          completar_datos_detallados(place);
        }, function errorCallback(response) {
          console.log('searchDetails(): Error al obtener detalles.');
        });
      }else {
        completar_datos_detallados(place);
      }

    };


    /**
      Completa los datos detallados del lugar indicado por parametros
    */
    function completar_datos_detallados(place) {
      if (place.types){ //si tiene types -> es de google places -> hay que traducirlos
        $scope.translateTypes(place);
      }else{
        $scope.result_detail.tipos = ''; //si no, se vacian los tipos anteriores
        //TODO: obtener tipos/categorias de empresa local como string unido con ,.
      }

      if (place.details)
        $scope.getReviews(place);

      $scope.result_detail.horarios = $scope.getEstado(place);
      $scope.result_detail.name = place.razonSocial || place.name;
      $scope.result_detail.img = place.img_src; //$scope.getImage(place);
      $scope.result_detail
        .direccion = place.formatted_address ||
                    place.vicinity ||
                    place.domicilio ||
                    'Dirección no disponible';
      $scope.result_detail.sitio_web = {};
      $scope.result_detail.sitio_web.href = place.website || '#';
      $scope.result_detail.sitio_web.link = place.website || 'Sitio web no disponible';
      $scope.result_detail.telefono = place.formatted_phone_number || place.telefono || 'No disponible';
      if(place.rating){
        $('#rating-label').show();
        $scope.result_detail.rating = place.rating;
      }else
        $('#rating-label').hide();
    }


    /**
      Obtiene las reseñas para un lugar y setea la primera.
    */
    $scope.getReviews = function(place) {
      var avatar = 'http://fillmurray.com/50/50';
      $scope.reviews = place.details.reviews;
      if ($scope.reviews){
        $scope.reviews.forEach(function (review) {
          review.profile_photo_url = review.profile_photo_url || avatar;
        });
        $scope.current_review = $scope.reviews[0] || {};
      }
    };

    /**
      Slider: obtiene la siguiente reseña
    */
    $scope.getNextReview = function() {
      var current_index = $scope.reviews.indexOf($scope.current_review);
      if (current_index < $scope.reviews.length - 1)
        $scope.current_review = $scope.reviews[current_index + 1];
      if (current_index === $scope.reviews.length - 1)
        $scope.current_review = $scope.reviews[0];
    };

    /**
      Slider: obtiene la anterior reseña
    */
    $scope.getPreviousReview = function() {
      var current_index = $scope.reviews.indexOf($scope.current_review);
      if (current_index === 0)
        $scope.current_review = $scope.reviews[$scope.reviews.length - 1];
      if (current_index > 0)
        $scope.current_review = $scope.reviews[current_index - 1];
    };

    /**
      Obtiene el estado de un lugar: Abierto, Cerrado o No disponible.
    */
    $scope.getEstado = function (place) {
      console.log(place);
      if (place.details){ //es de google places
        $('.show-horarios-btn').show();
        $scope.setDiasYHorariosGPlaces(place.details.opening_hours.weekday_text);
        return (place.opening_hours.open_now) ? 'Abierto': 'Cerrado';
      }else{
        if (place.opening_hours){ //es local
          $scope.setDiasYHorariosLocal(place);
          return $scope.isLocalPlaceOpenNow(place) ? 'Abierto': 'Cerrado';
        }else{
          $('.show-horarios-btn').hide();
          return 'No disponible';
        }
      }
    };

    /**
      Retorna true si el lugar (empresa local), se encuentra abierto
      en el momento de la consulta.
    */
    $scope.isLocalPlaceOpenNow = function (place){
      moment.locale("es");
      var today = moment(new Date()).format("dddd"); //dia de la semana actual, en español
      var openInPeriods = [];
      for(var i = 0; i < place.opening_hours.length; i++){
        if (place.opening_hours[i].day.toLowerCase() === today){ //solo evaluamos si es el dia de hoy
          for(var j = 0; j< place.opening_hours[i].periods.length; j++){
            var period = place.opening_hours[i].periods[j];
            var from_date = new Date(period.from).toTimeString().split(' ')[0]; //nos da hh:mm:ss
            var to_date = new Date(period.to).toTimeString().split(' ')[0];
            var from_moment = moment(from_date, 'hh:mm:ss');
            var to_moment = moment(to_date, 'hh:mm:ss');
            var now = moment(new Date(), 'hh:mm:ss');
            // usando moment.js podemos hacer la comparacion hora_apertura >= hora_actual <= hora_cierre
            openInPeriods.push(now.isSameOrAfter(from_moment) && now.isSameOrBefore(to_moment));
          }
          return openInPeriods[0] || openInPeriods[1];
        }
      }

    };

    /**
      Setea los dias y horarios de atencion de un lugar (Google Places)
      y lo muestra en pantalla.
    */
    $scope.setDiasYHorariosGPlaces = function (weekday_text) {
      $('.horarios-body').empty();
      weekday_text.map(function (value){
        $http({
          method: 'POST',
          url: '/translate',
          data: {
            term: value
          }
        }).then(function successCallback(response) {
          $scope.horarios.push(response.data.result_text);
        }, function errorCallback(response) {
          console.log('setDiasYHorarios(): Error al obtener traducciones.');
        });
      });
    };

    /**
      Setea los dias y horarios de atencion de un lugar (Empresa local)
      y lo muestra en pantalla.
    */
    $scope.setDiasYHorariosLocal = function(place) {
      var dia, periodo, horarios;
      for(var i = 0; i < place.opening_hours.length; i++) {
        for(var j = 0; j< place.opening_hours[i].periods.length; j++){
          dia = place.opening_hours[i].day;
          periodo = place.opening_hours[i].periods[j];
          if (periodo.from != null && periodo.from != ''){
            horarios = new Date(periodo.from).toTimeString().split(' ')[0] +
            ' a ' + new Date(periodo.to).toTimeString().split(' ')[0];
            $scope.horarios.push((dia+' '+horarios));
          }
        }
      }
    }


    /**
      Muestra/Oculta detalles de horarios semanales en la informacion del lugar.
    */
    $scope.toggleHorarios = function () {
      $('.horarios-info').toggleClass('invisible');
      var icons = $('.show-horarios-btn .material-icons')[0];
      var arrow = icons.innerHTML;
      if (arrow === 'keyboard_arrow_down')
        icons.innerHTML = 'keyboard_arrow_up';
      else
        icons.innerHTML = 'keyboard_arrow_down';

    };


    /** Verifica el error provocado al inicializar el mapa */
    $scope.verificarError = function (error) {
      if (error.code === error.PERMISSION_DENIED) {
        $('#map').addClass('location-disabled');
        $('#map')[0].innerHTML = '<p class="text-center">'+
          'Debe habilitar el acceso a la ubicación para continuar</p></div>';
        $('.search-input').attr('disabled','');
      }
    };

    /** Inicializa una instancia del mapa y lo centra en la posicion obtenida */
    $scope.initMap = function (position) {
      $scope.position = position;
      var lat = $scope.position.coords.latitude;
      var lng = $scope.position.coords.longitude;
      var center = { lat: lat, lng: lng };
      var opt = { scrollwheel: false, zoom: 15, center: center };
      if ($('#map')[0]) {
        uiGmapApi.then(function(maps) {
          $scope.map = new maps.Map($('#map')[0], opt);
          $scope.circle = new maps.Circle({
            map: $scope.map,
            radius: $scope.search_radius, // 2 miles in metres
            strokeColor: '#009bc9',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#009bc9',
            fillOpacity: 0.10,
            center: center
          });
          //circle.bindTo('center', 'position');
          $scope.setSearchRadius(500, '500m');
        });
        $('#map').removeClass('location-disabled');
        $('.search-input').removeAttr('disabled');

      }
    };

    /**
      Obtiene la ubicacion del usuario
    */
    $scope.obtenerUbicacion = function () {
      var geo = navigator.geolocation;
      if (geo)
        geo.getCurrentPosition($scope.initMap, $scope.verificarError);
      else
        $('#map').innerHTML = 'Geolocation is not supported by this browser.';
    };

    /**
      Actualiza el nivel de zoom segun la opcion de radio de busqueda elegida
    */
    $scope.update_map_zoom = function () {
      var zoom_levels = { '500m': 15, '1km': 14, '5km': 12, '10km': 11, '20km': 10 };
      $scope.map.setZoom(zoom_levels[$scope.search_radius_text]);
      $scope.circle.setRadius($scope.search_radius);
    };

    /**
      Setea el parametro search_radius para futuras busquedas
    */
    $scope.setSearchRadius = function (radius, radius_text){
      $scope.search_radius = radius;
      $scope.search_radius_text = radius_text;
      $('.radius-option').removeClass('active');
      $('.radius-option#radius-'+radius).addClass('active');
      $scope.update_search_placeholder();
      $scope.update_map_zoom();
    };

    $scope.deleteLocally = function (empresa) {
      console.log('eliminando empresa', empresa);
      $http({
        method: 'DELETE',
        url: '/api/empresas/'+empresa._id,
        user: $scope.authentication.user,
        data: empresa
      }).then(function successCallback(response) {
        console.log('exito al eliminar');
      }, function errorCallback(response) {
        console.log('saveLocally(): Error al eliminar.');
      });
    };

    $scope.saveLocally = function(empresa, index) {
      console.log('GUARDO ' + JSON.stringify(empresa));
      if ($('#save-'+index)[0].innerHTML === 'favorite'){ //Elimina de favs
        $('#save-'+index)[0].innerHTML = 'favorite_border';
        $scope.deleteLocally(empresa);
      }else{ //Agrega a favs
        $('#save-'+index)[0].innerHTML = 'favorite';
        // $http({
        //   method: 'POST',
        //   url: '/api/empresas/importar',
        //   user: $scope.authentication.user,
        //   data: empresa
        // }).then(function successCallback(response) {
        //   console.log(response);
        // }, function errorCallback(response) {
        //   console.log('saveLocally(): Error al guardar localmente.');
        // });
      }
    };

    /**
      Registra el voto (like/dislike) de la empresa indicada por parametros
    */
    $scope.vote = function (empresa, index) {
      var like = true;
      if ($('#save-'+index)[0].innerHTML === 'favorite'){ //Dislike
        $('#save-'+index)[0].innerHTML = 'favorite_border';
        like = false;
      }else { //Like
        $('#save-'+index)[0].innerHTML = 'favorite';
      }
      var data = { 'like': like, 'empresa': empresa, 'user': $scope.authentication.user };
      $http.post('/api/empresas/vote', data)
      .then(function successCallback(response) {
        console.log(response);
        console.log('Empresas Likeadas', $scope.authentication.user.empresasLikeadas);
      }, function errorCallback(response) {
        console.log('vote(): Error al guardar localmente.', response);
      });
    };

    /**
      Retorna true si el usuario esta logueado. Caso contrario retorna false.
    */
    $scope.userIsLoggedIn = function(){
      return ($scope.authentication.user !== '') ? true : false;
    };

    /**
      Retorna true si el usuario ha likeado el lugar con id indicado por
      parametros.
    */
    $scope.hasUserLiked = function(place_id){
      return ($scope.authentication.user.empresasLikeadas.includes(place_id)) ? true : false;
    };


    $scope.isPlaceOpen = function(place){
      if (place.name){ //es google place
        if (place.opening_hours)
          return place.opening_hours.open_now;
        else
          return false;
      }
      else //es local porque en lugar de name tiene razonSocial
        return $scope.isLocalPlaceOpenNow(place);

    };


    $scope.setFilter('all'); //Seteamos el filtro inicial a 'Todos'
    $scope.obtenerUbicacion();

  }
]);
