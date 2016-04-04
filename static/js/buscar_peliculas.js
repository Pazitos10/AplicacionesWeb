var genres_list;

function get_genres_list(){
    var API_KEY = "53eb1914f7a9090c92553339f74280ce";
    var url =  'https://api.themoviedb.org/3/genre/movie/list?api_key='+ API_KEY;
    return $.ajax({
        url: url,
        method: "GET"
    }).done(function(data){
        if (!genres_list){
            genres_list = data.genres;
        }else{
            genres_list = [];
        }
    });
}

get_genres_list();


$(document).ready(function () {

    function buscar_peliculas(search_term) {
        //alert("Busco " + "api.php/movies?term=" + search_term);
        $.ajax({
                url: "api.php/movies?term=" + search_term,
                method: "GET"
            })
            .done(function( data ) {
                //alert("Encontre " + data);
                mostrar_peliculas(data, search_term);
            });
    }

    function mostrar_peliculas(peliculas, search_term) {
        if (peliculas == undefined) {
            $(document).trigger("add-alerts", {
                message: "No se encontraron Peliculas con Id o Titulo " + search_term,
                priority: "warning"
            });
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
                "   <img id='" + pelicula_portada_id + "' class='portada' src='http://fillmurray.com/140/209' alt='' />",
                "   <p class='titulo'>" + pelicula['title'] + "</p>",
                "   <div class='puntaje'>",
                "       <input id='ratings-hidden' name='rating' type='hidden'>",
                "       <div class='text-right'>",
                "           <div class='stars starrr' data-rating='3'></div>",
                "       </div>",
                "   </div>",
                "</div>",
            ].join("\n"));

            lista_peliculas.append(pelicula_item);
            buscar_poster(pelicula['id'], pelicula_portada_id);

        }
    }

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

    function get_genre_name_by_id(id){
        var name = '';
        for (var i in genres_list) {
            if (genres_list[i].id === id){
                name = genres_list[i].name;
                return name;
            }
        }
    }

    /**
    * Devuelve los generos de una pelicula con un formato legible
    * @param Array genres
    */
    function get_genres_name(genres_array){
        var genres = '';
        if (!genres_array.some(isNaN)){
            //solo contiene ids
            for (var i in genres_array){
                if(genres != ''){
                    genres += " | "+ get_genre_name_by_id(genres_array[i]);
                }else{
                    genres += get_genre_name_by_id(genres_array[i]);
                }
            }
        }else {
            for (var i in genres_array) {
                if (genres !== ''){
                    genres += " | " +genres_array[i].name;
                }else {
                    genres += genres_array[i].name;
                }
            }
        }
        return genres;
    }


    function autocomplete_by_id(data){
        var poster_url = "http://placehold.it/150x200?text=Sin+Imagen";
        if (data.poster_path !== null ){
            poster_url = "http://image.tmdb.org/t/p/w150" + data.poster_path;
        }
        var rating = data.vote_average;
        if(rating > 5.0){
            rating = 5.0;
        }
        pelicula = {
            titulo: data.original_title,
            generos: get_genres_name(data.genres),
            anio: new Date(String(data.release_date)).getFullYear(),
            poster_url: poster_url,
            rating: rating
        };
        return pelicula;
    }


    function show_results(data){
        $('#search-results').remove(); //Limpiamos resultados anteriores
        var resultados = "<div class='form-results' id='search-results'>"+
                        "<p><strong>"+data.total_results+"</strong> Resultados para '"+$('#id').val()+"'</p>";
        var max_substr = 550;
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
        resultados += "<hr></div>";
        $('.form-alta-container').append(resultados);
        $('.portada-search-result').on("click", function (e) {
            e.preventDefault();
            var target = $( e.target );
            autocompletar_form(target.attr('imdb-id'));
        });
    }

    function autocomplete_succeed(data){
        limpiar_form();
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
                    "<input id='ratings-hidden' name='rating' type='hidden'>"+
                    "<input id='rating' type='hidden' class='rating' data-filled='glyphicon glyphicon-star' data-empty='glyphicon glyphicon-star-empty' data-fractions='2' />"+
                "</div>"+
                "<p id='title-display'>"+pelicula.titulo+"</p>"+
                "<p id='genre-display'>"+pelicula.generos+"</p>"+
                "<p id='year-display'>"+pelicula.anio+"</p>"+
            "</div>"+
            "<div class='col-sm-12' id='btn-guardar'>"+
                "<button type='submit' class='btn btn-primary'>Guardar</button>"+
            "</div>";
            form_input.after(info_pelicula);

            // Datos para enviar con el form
            $("#title").attr("value", pelicula.titulo);
            $("#genre").attr('value', pelicula.generos);
            $("#year").attr("value", pelicula.anio);
            $('#rating').rating('rate', pelicula.rating);
        }
    }


    function autocomplete_failed(){
        limpiar_form();
        var form_input = $('#form-input');
        var poster_url = "static/img/404-movie-not-found.gif";
        var info_pelicula = "<div class='info-pelicula'>"+
                                "<div class='portada-container-404'>"+
                                    "<p><strong>'"+$('#id').val()+"'</strong> No produjo resultados.</p>"+
                                    "<img class='portada portada-404' src='"+poster_url+"' alt='404-movie-not-found'>"+
                                "</div>"+
                            "</div>";
        form_input.after(info_pelicula);
    }

    /**
    * Busca informacion de la pelicula en IMDB y la muestra en pantalla
    * @param String imdb_id Id de IMDB
    */
    function autocompletar_form(imdb_id){
        limpiar_form();
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        if(isFinite(imdb_id)  || imdb_id.startsWith('tt')){
            //buscamos por id
            var url = "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY;
            //console.log(url);
        }else{
            var titulo = encodeURI(imdb_id);
            var url  = "http://api.themoviedb.org/3/search/movie?api_key="+ API_KEY+ "&query="+ titulo;
        }
        $.ajax({
            url: url,
            method: "GET"
            })
            .done(function (data) { autocomplete_succeed(data) })
            .fail(autocomplete_failed());
    }


    $("#search").click(function () {
        var search_term = $("#search_term").val();
        if (search_term.length != 0) {
            buscar_peliculas(search_term);
        } else {
            $(document).trigger("add-alerts", {
                message: "Por favor, ingrese el Id de la pelicula",
                priority: "error"
            });
            $("#search_term").focus();
            setInterval(function () {$(document).trigger("clear-alerts");}, 4500);
        }

    });


    //Funcion de autocomplete
    $("#search_term").keyup(function () {
        console.log('hola');
        var that = this,
            value = $(this).val();

        if (value.length >= 3 ) {
            procesar_busqueda(value);
        }
    });


    function limpiar_form(){
        $('.form-alta #id').value = '';
        $('.form-alta .info-pelicula').remove();
        $('.form-alta #btn-guardar').remove();
        $('.form-alta-container #search-results').remove(); //Limpiamos resultados anteriores
    }

    $('.form-alta #id').change(function () {
        if ($(this).val() !== '') {
            console.log($(this).val());
            autocompletar_form($(this).val())
        }else{
            limpiar_form();
        }
    });
});
