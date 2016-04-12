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
            method: "GET"
        })
        .done(function( data ) {
            $("#" + img_id).attr("src", "http://image.tmdb.org/t/p/w150" + data.poster_path);
        });
    }

    function buscar_peliculas(search_term) {
        //alert("Busco " + "api.php/movies?term=" + search_term);
        if(search_term !== "*"){
            $.ajax({
                    url: "api.php/movies?term=" + search_term,
                    method: "GET"
                })
                .done(function( data ) {
                    mostrar_peliculas(data, search_term);
                });
        }else{
            $.ajax({
                    url: "api.php/movies",
                    method: "GET"
                })
                .done(function( data ) {
                    mostrar_peliculas(data, "");
            });
        }
    }

    function mostrar_peliculas(peliculas, search_term) {
        if (peliculas == undefined) {
            //Habria que distinguir si no se encontraron de verdad o bien, no existen peliculas en la db
            if (search_term.length > 0){
                $(document).trigger("add-alerts", {
                    message: "No se encontraron Peliculas con Id o Titulo ' " + search_term +" '. <a href='save_movie.html?term=" + search_term + "'>Buscarla en IMDB</a>",
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
                "   <a href='compare_movie.php?id="+pelicula['id']+"' title='Comparar puntuaciones'><img id='" + pelicula_portada_id + "' class='portada' src='http://fillmurray.com/140/209' alt='' /></a>",
                "   <p class='titulo'>" + pelicula['title'] + "</p>",
                "   <div class='puntaje puntaje-form'>",
                "    <input type='hidden' ",
                "    name='rating' id='rating' class='rating' data-filled='glyphicon glyphicon-star' data-pelicula-id=" + pelicula["id"],
                "    data-empty='glyphicon glyphicon-star-empty' data-fractions='2' value='"+pelicula["rating"]+"'/>",
                "   </div>",
                "</div>"
            ].join("\n"));
            buscar_poster(pelicula['id'], pelicula_portada_id);
            lista_peliculas.append(pelicula_item);
            $('.rating').rating();
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
            method: "GET"
        })
        .done(function (data) { autocomplete_succeed(data) })
        .fail(autocomplete_failed());
    }
    function autocomplete_succeed(data){
        var form_input = $('#form-input');
        pelicula = {};
        if (data.hasOwnProperty('total_results')){
            //Search by title
            if (data.total_results > 0){
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
                alert("Me cambiaron el rating");
                pelicula.rating = $(this).val();
                console.log(pelicula.rating);
                $.ajax({
                    url: "api.php/movies",
                    method: "POST",
                    data: pelicula
                }).done(function(data){
                    console.log(data);
                    $(document).trigger("add-alerts", {
                        message: "Pelicula guardada con éxito!",
                        priority: "success"
                    });
                    setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
                }).fail(function(data){
                    console.log(data.responseText["msg"]);
                    $(document).trigger("add-alerts", {
                        message: "Error al guardar ",
                        priority: "error"
                    });
                    setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
                });
            });
        }
    }
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
    function show_results(data){
        $('.results-container').empty(); //Limpiamos resultados anteriores

        var resultados = "<div class='form-results' id='search-results'>"+
        "<p class='text-center'><strong>"+data.total_results+"</strong> Resultados para '"+$('.search-input #search-term-input').val()+"'</p>";
        var max_substr = 550;
        mostrar_paginacion(data.total_pages, data.page);

        //console.log(data);
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
    function autocomplete_by_id(data){
        limpiar_form();
        var poster_url = "http://placehold.it/150x200?text=Sin+Imagen";
        if (data.poster_path !== null ){
            poster_url = "http://image.tmdb.org/t/p/w150" + data.poster_path;
        }
        var rating = data.vote_average;
        if(rating > 5.0){
            rating = 5.0;
        }
        pelicula = {
            id: data.id,
            title: data.original_title,
            genre: get_genres_name(data.genres),
            year: new Date(String(data.release_date)).getFullYear(),
            poster_url: poster_url,
            rating: rating
        };
        return pelicula;
    }
    //Funcion de autocomplete
    // $("#search_term").keyup(function () {
    //     var that = this,
    //         value = $(this).val();
    //
    //     if (value.length >= 3 ) {
    //         buscar_peliculas(value);
    //     }
    // });



    /* Event handling */

    $("#search-term-input").keypress(function( event ) {
        if ( event.which == 13 ) {
            $('.search-input #search-term-button').click();
        }
    });

    $(".navbar-form #search-term-button").click(function () {
        var search_term = $("#search-term-input").val();
        if (search_term.length != 0) {
            buscar_peliculas(search_term);
        } else {
            $(document).trigger("add-alerts", {
                message: "Por favor, ingrese el Id de la pelicula",
                priority: "error"
            });
            $(".navbar-form #search-term-input").focus();
            setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
        }

    });

    $('.search-input #search-term-button').click(function () {
        var term = $('.search-input #search-term-input').val();
        if (term !== '') {
            autocompletar_form(term);
        }else{
            limpiar_form();
        }
    });

    if (getUrlParameter("term")) {
        autocompletar_form(getUrlParameter("term"));
    } else {
        buscar_peliculas("*");

    }




});
