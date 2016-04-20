$(document).ready(function () {
    /**
    * Devuelve la URL con la imagen de poster de la pelicula
    * @param String imdb_id Id de IMDB
    * @param String img_id Id del objeto IMG
    */
    function buscar_poster(imdb_id, img_id) {

        var img_url;
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        $.ajax({
            url: "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY,
            type: "GET"
        })
        .done(function( data ) {
            $("#" + img_id).attr("src", "http://image.tmdb.org/t/p/w150" + data.poster_path);
        });
    }

    function buscar_peliculas(search_term) {
        //alert("Busco " + "api.php/movies?term=" + search_term);
        var url = "api.php/movies";
        if(search_term !== "*")
            url += "?term=" + search_term;
        $.ajax({
                url: url,
                type: "GET"
            }).done(function( data ) {
                mostrar_peliculas(data, search_term);
            });
    }

    function mostrar_peliculas(peliculas, search_term) {
        if (peliculas == undefined) {
            //Habria que distinguir si no se encontraron de verdad o bien, no existen peliculas en la db
            if (search_term.length > 0){
                $(document).trigger("add-alerts", {
                    message: "No se encontraron Peliculas con Id o Titulo ' " + search_term +" '. <a id='buscar-en-imdb' href='save_movie.html?term=" + search_term + "'>Buscarla en IMDB</a>",
                    priority: "warning"
                });
            }
            return;
        }

        //Limpio peliculas anteriores
        var lista_peliculas = $("#lista_peliculas");
        lista_peliculas.empty();

        for(var i=0;i<peliculas.length;i++){
            var pelicula = peliculas[i];
            /**
             * Aca busco la imagen en IMDB
             * http://stackoverflow.com/questions/151272/given-an-imdb-movie-id-how-do-i-programmatically-get-its-poster-image
             */
            var pelicula_portada_id = "portada-" + pelicula['id'];
            var pelicula_item = $([
                "<div class='col-md-2 col-lg-2 item-pelicula'>",
                "   <span class='overlay' id='overlay-portada-"+  pelicula['id'] +"' data-pelicula-id='" + pelicula['id'] +"' ></span>",
                "   <img id='" + pelicula_portada_id + "' class='portada' src='http://fillmurray.com/140/209' alt='' />",
                "   <p class='titulo'>" + pelicula['title'] + "</p>",
                "   <div class='puntaje puntaje-form'>",
                "    <input type='hidden' ",
                "    name='rating' id='rating' class='rating' data-filled='glyphicon glyphicon-star' data-pelicula-id=" + pelicula["id"],
                "    data-empty='glyphicon glyphicon-star-empty' data-fractions='2' value='"+pelicula["rating"]+"'/>",
                "   </div>",
                // "   <button class='btn btn-xs compare-movie' id='compare-movie-" + pelicula['id'] + "' data-pelicula-id='" + pelicula['id'] + "'>Comparar</button>",
                "</div>"
            ].join("\n"));
            buscar_poster(pelicula['id'], pelicula_portada_id);
            lista_peliculas.append(pelicula_item);
            $('.rating').rating();
            $('#overlay-portada-' + pelicula['id']).bind("click", function(e) {
                comparar($(this).data('pelicula-id'));
            });
        }
    }

    function mostrar_paginacion(total_pages, current_page){
        $('.result-pages').empty();
        if(total_pages > 1){
            var pagination_markup = "<ul class='pagination pagination-lg'>";
            for (i = 1; i <= total_pages; i++) {
                if(i === current_page){
                    pagination_markup += "<li class='active'><a class='page-link'>"+i+"</a></li>";
                }else{
                    pagination_markup += "<li><a class='page-link'>"+i+"</a></li>";
                }
            }
            pagination_markup += "</ul>";
            $('.result-pages').append(pagination_markup);
            $('.page-link').click(function(){
                var page = this.innerHTML;
                autocompletar_form($('#search-term-input').val(), page);
            });
        }
    }


    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };


    /**
    * Devuelve los generos de una pelicula con un formato legible
    * @param Array genres
    */
    function get_genres_name(genres_array){
        var genres = '';
        for (var i in genres_array) {
            if (genres !== ''){
                genres += " | " +genres_array[i].name;
            }else {
                genres += genres_array[i].name;
            }
        }
        return genres;
    }

    function limpiar_form(){
        $('.search-input #search-term-input').val('');
        $('.form-alta .info-pelicula').remove();
        $('.form-alta-container #search-results').remove(); //Limpiamos resultados anteriores
        $('.result-pages').empty(); //elimina los componentes de paginacion
    }


    /*Autocompletado */

    /**
    * Busca informacion de la pelicula en IMDB y la muestra en pantalla
    * @param String imdb_id Id de IMDB
    */
    function autocompletar_form(imdb_id, page){
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        var url;
        if(isFinite(imdb_id)  || imdb_id.startsWith('tt')){
            url = "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY;
        }else{
            var titulo = encodeURI(imdb_id);
            url  = "http://api.themoviedb.org/3/search/movie?api_key="+ API_KEY+ "&query="+ titulo;
            if (page !== undefined){
                url += "&page="+ page;
            }
        }
        $.ajax({
            url: url,
            type: "GET"
        })
        .done(function (data) { autocomplete_succeed(data) })
        .fail(autocomplete_failed());
    }

    /* Genera el markup con la informacion de la pelicula cuando la busqueda fue exitosa */
    function autocomplete_succeed(data){
        var form_input = $('#form-input');
        pelicula = {};
        if (data.hasOwnProperty('total_results')){
            //Search by title
            if (data.total_results > 0){
                $('.search-input-alta #search-term-input').val(data.original_title);
                show_results(data);
            } else{
                autocomplete_failed();
            }
        }else{
            //Search by Id
            pelicula = autocomplete_by_id(data);
            var info_pelicula = "<div class='form-group info-pelicula'>"+
            "<div class='portada-container'>"+
            "<img class='portada' id='portada-id' src='"+pelicula.poster_url+"' alt=''>"+
            "</div>"+
            "<div class='puntaje puntaje-form'>"+
            "<input type='hidden' name='rating' id='rating' class='rating' data-filled='glyphicon glyphicon-star' data-empty='glyphicon glyphicon-star-empty' data-fractions='2' />"+
            "</div>"+
            "<p id='title-display'>"+pelicula.title+"</p>"+
            "<p id='genre-display'>"+pelicula.genre+"</p>"+
            "<p id='year-display'>"+pelicula.year+"</p>"+
            "</div>"+
            "</div>";
            form_input.after(info_pelicula);

            // Datos para enviar con el form
            $("#id").val(pelicula.id);
            $("#title").val(pelicula.title);
            $("#genre").val(pelicula.genre);
            $("#year").val(pelicula.year);
            $('#rating').rating('rate', pelicula.rating);
            $('.rating').change(function(){
                pelicula.rating = $(this).val();
                $.ajax({
                    url: "api.php/movies",
                    type: "POST",
                    data: pelicula
                }).done(function(data){
                    $(document).trigger("add-alerts", {
                        message: "Pelicula guardada con éxito!",
                        priority: "success"
                    });
                    setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
                }).fail(function(data){
                    $(document).trigger("add-alerts", {
                        message: "Error al guardar ",
                        priority: "error"
                    });
                    setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
                });
            });
        }
    }

    /* Genera el markup a mostrar cuando no se encontraron resultados a la busqueda */
    function autocomplete_failed(){
        var results_container = $('.results-container');
        results_container.empty();
        var poster_url = "static/img/404-movie-not-found.gif";
        var info_pelicula = "<div class='form-results' id='search-results'>"+
        "<div class='info-pelicula'>"+
        "<div class='portada-container-404'>"+
        "<p class='text-center'><strong>'"+$('.search-input #search-term-input').val()+"'</strong> No produjo resultados.</p>"+
        "<img class='portada portada-404' src='"+poster_url+"' alt='404-movie-not-found'>"+
        "</div>"+
        "</div>"+
        "</div>";
        results_container.append(info_pelicula);
    }

    /* Genera el markup para mostrar resultados cuando se buscan peliculas por titulo */
    function show_results(data){
        $('.results-container').empty(); //Limpiamos resultados anteriores
        var term = $('#search-term-input').val();
        if ($('#search-term-input').val().length === 0){
            var term = decodeURI(window.location.href.split("term=")[1]);
            $('#search-term-input').val(term);
        }
        var resultados = "<div class='form-results' id='search-results'>"+
        "<p class='text-center'><strong>"+data.total_results+"</strong> Resultados para '"+ term  +"'</p>";
        var max_substr = 550;
        mostrar_paginacion(data.total_pages, data.page);

        for (var i in data.results){
            var imdb_id = data.results[i].id;
            var poster_url = "http://placehold.it/92x138?text=Sin+Imagen";
            if (data.results[i].poster_path !== null ){
                poster_url = "http://image.tmdb.org/t/p/w92" + data.results[i].poster_path;
            }
            var titulo = data.results[i].original_title;
            var anio = new Date(data.results[i].release_date).getFullYear();
            if (isNaN(anio)){
                anio = 'unknown'
            }
            var resultado_item = "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 search-result-item'>"+
            "<div class='item-pelicula'>"+
            "<img imdb-id="+imdb_id+" class='portada portada-search-result' src='"+poster_url+"' alt='"+titulo+"'/>"+
            "<p class='titulo-result dont-break-out'>"+titulo+"</p>"+
            "<p class='year-result'> ("+anio+") </p>"+
            "</div>"+
            "</div>";
            resultados+= resultado_item;
        }
        resultados += "</div>";
        $('.results-container').append(resultados);
        $('.portada-search-result').on("click", function (e) {
            e.preventDefault();
            var target = $( e.target );
            autocompletar_form(target.attr('imdb-id'));
        });
    }

    /* Autocompleta la informacion de una pelicula basandose en su id*/
    function autocomplete_by_id(data){
        limpiar_form();
        $('.search-input').replaceWith("<span class='link-container'><a class='glyphicon glyphicon-chevron-left' style='font-size: 20px' href=''></a></span>");
        var poster_url = "http://placehold.it/150x200?text=Sin+Imagen";
        if (data.poster_path !== null ){
            poster_url = "http://image.tmdb.org/t/p/w150" + data.poster_path;
        }
        pelicula = {
            id: data.imdb_id,
            title: data.original_title,
            genre: get_genres_name(data.genres),
            year: new Date(String(data.release_date)).getFullYear(),
            poster_url: poster_url,
            rating: 0.0
        };
        return pelicula;
    }

    /* Realiza el query a la api externa indicada para la comparacion de ratings */
    function consultar_api_externa (grupo, imdb_id) {
        var query = {};
        switch (grupo) {
            case 1:
                query.url = localStorage.getItem('url-grupo-1')+'/peliculas/'+ imdb_id +'/comparar';
                query.param_name = "ponderacion";
                query.result_type = 'int';
                break;
            case 2:
                query.url = localStorage.getItem('url-grupo-2')+'/movie/data?id=' + imdb_id;
                query.param_name = "ranking";
                query.result_type = 'float';
                break;
            case 3:
                query.url = localStorage.getItem('url-grupo-3')+'/proyecto/buscapelicula.php?id='+ imdb_id;
                query.param_name = "ponderacion";
                query.result_type = 'int';
                break;
        }
        // console.log(query.url);
        $.ajax({
            url: query.url,
            type: "GET",
            crossDomain: true
        }).done(function(data){
            if (!$.isEmptyObject(data)){
                $('#rating-externo').removeClass("rating-err");
                $('#rating-externo').removeClass("rating-win");
                $('#rating-local').removeClass("rating-win");
                var rating = data[query.param_name];
                if (query.result_type === 'int'){
                    rating = data[query.param_name]/2.0;
                }
                if( $('#rating-local').html() > $('#rating-externo').html()){
                    $('#rating-externo').removeClass("rating-win");
                    $('#rating-local').addClass("rating-win");
                }else {
                    $('#rating-local').removeClass("rating-win");
                    $('#rating-externo').addClass("rating-win");
                }
                $('#rating-externo').html(rating);
            }else {
                $('#rating-externo').html("-1.0");
                $('#rating-externo').addClass("rating-err");
            }
        }).fail(function () {
            $('#rating-local').addClass("rating-win");
            $('#rating-externo').html("Error de conexión");
            $('#rating-externo').addClass("rating-err");
            console.log('Error: URL not reachable');
        });
    }

    /* Autocompleta el formulario de URLs de apis externas */
    function completarApisURL() {
        var name = 'url-grupo-';
        for (var i = 0; i < 3; i++) {
            // console.log(localStorage.getItem(name+String(i+1)));
            $('input[name='+name+String(i+1) +']').val(localStorage.getItem(name+String(i+1)));
        }
    }

    /*
     * Logica para la comparacion de peliculas
     */
    function comparar(id) {
        generar_modal(id, function(){
            $('#myModal').modal('show');
        });
    }

    /* Genera el markup para el modal de comparacion */
    function generar_modal(imdb_id, callback){
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        var url = "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY;
        $.ajax({
            url: url,
            type: "GET"
        })
        .done(function (data) {
            $('.modal-title-comparacion').html(data.original_title);
            var genres = get_genres_name(data.genres);
            var overview = data.overview;
            if( overview.length > 125)
                overview = overview.substring(0, 125)+" ...";
            var markup_pelicula =
            "<img id='' class='portada' src='http://image.tmdb.org/t/p/w150"+ data.poster_path +"' alt='' />" +
            "<div class='puntaje puntaje-modal'>" +
            "    <input type='hidden'" +
            "    name='rating' id='rating-"+data.imdb_id+"' class='rating' data-filled='glyphicon glyphicon-star'" +
            "    data-empty='glyphicon glyphicon-star-empty' data-fractions='2' value=''/>"+
            "</div>";
            $("#myModal #info").html(markup_pelicula);
            $('#release-date').html(new Date(data.release_date).getFullYear());
            $('#overview-text').html(overview);
            $('#genres').html(genres)
            $('#select-grupo-comparacion').click(function (){
                consultar_api_externa($(this)[0].selectedIndex+1, imdb_id);
            });
            $.ajax({
                    url: "api.php/movies?term=" + imdb_id,
                    type: "GET"
                })
                .done(function( data_api ) {
                    var rating = data_api[0].rating
                    $('#rating-'+imdb_id).rating('rate', rating );
                    $('#rating-local').html(rating);
            });
            callback();
        })
    }

    /* Event handling */
    $('#info-grupos-btn').click(function(){
        $('#modal-info-grupos').modal('show');
        completarApisURL();
    });

    $("#search-term-input").keypress(function( event ) {
        if ( event.which == 13 ) {
            $('.search-input #search-term-button').click();
        }
    });

    $(".navbar-form #search-term-button").click(function () {
        var search_term = $("#search-term-input").val();
        buscar_peliculas(search_term);
    });

    $('.search-input #search-term-button').click(function () {
        var term = $('.search-input #search-term-input').val();
        if (term !== '') {
            autocompletar_form(term);
        }else{
            limpiar_form();
        }
    });

    $('#guardar-urls').click(function (e) {
        e.preventDefault();
        var url = '';
        var name = '';
        for (var i = 0; i < 3; i++) {
            name = "url-grupo-"+String(i+1);
            url = localStorage.getItem(name);
            url_input = $('input[name='+name+']').val();
            if (url === undefined){
                if (url_input.startsWith('http://')){
                    url = url_input;
                }else{
                    url = 'http://'+ url_input;
                }
                localStorage.setItem(name, url);
            } else {
                localStorage.setItem(name, url_input);
            }
        }
        $('#modal-info-grupos').modal('hide');
        $(document).trigger("add-alerts", {
            message: "URLs guardadas con éxito!",
            priority: "success"
        });
        setInterval(function () {$(document).trigger("clear-alerts");}, 4500);

    });


    if (getUrlParameter("term")) {
        autocompletar_form(getUrlParameter("term"));
    } else {
        buscar_peliculas("*");

    }

});
