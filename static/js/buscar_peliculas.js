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
                //console.log("http://image.tmdb.org/t/p/w150" + data.poster_path);
                $("#" + img_id).attr("src", "http://image.tmdb.org/t/p/w150" + data.poster_path);
            });
    }

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


    function autocomplete_succeed(data){
        limpiar_form();
        if (data.hasOwnProperty('total_results')){
            if (data.total_results > 0){
                data = data.results[0];
            }else{
                autocomplete_failed();
                return false;
            }
        }
        var form_inputs = $('#form-inputs');
        var titulo = data.original_title;
        //TODO: Verificar cuando viene por titulo, genres no existe -> genres_ids existe y hay que buscar los nombres a mano
        var generos = get_genres_name(data.genres);
        var anio = new Date(String(data.release_date)).getFullYear();
        var poster_url = "http://placehold.it/150x200?text=Sin+Imagen";
        if (data.poster_path !== null ){
            poster_url = "http://image.tmdb.org/t/p/w150" + data.poster_path;
        }
        var rating = data.vote_average;
        if(rating > 5.0){
            rating = 5.0;
        }
        var info_pelicula = "<div class='form-group info-pelicula'>"+
            "<div class='portada-container'>"+
                "<img class='portada' id='portada-id' src='"+poster_url+"' alt=''>"+
            "</div>"+
            "<div class='puntaje puntaje-form'>"+
                "<input id='ratings-hidden' name='rating' type='hidden'>"+
                "<input id='rating' type='hidden' class='rating' data-filled='glyphicon glyphicon-star' data-empty='glyphicon glyphicon-star-empty' data-fractions='2' />"+
            "</div>"+
            "<p id='title-display'>"+titulo+"</p>"+
            "<p id='genre-display'>"+generos+"</p>"+
            "<p id='year-display'>"+anio+"</p>"+
        "</div>";
        form_inputs.after(info_pelicula);

        // Datos para enviar con el form
        $("#title").attr("value", titulo);
        $("#genre").attr('value', generos);
        $("#year").attr("value", anio);
        $('#rating').rating('rate', rating);
    }


    function autocomplete_failed(){
        limpiar_form();
        var form_inputs = $('#form-inputs');
        var poster_url = "http://i.imgur.com/WCeJfRi.webm";
        var info_pelicula = "<div class='form-group info-pelicula'>"+
            "<div class='portada-container'>"+
                "<video class='portada portada-404' id='portada-id' src='"+poster_url+"' alt='' autoplay loop type='video/webm'>"+
            "</div>"+"</div>";
        form_inputs.after(info_pelicula);
    }

    /**
    * Busca informacion de la pelicula en IMDB y la muestra en pantalla
    * @param String imdb_id Id de IMDB
    */
    function autocompletar_form(imdb_id){
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        if(imdb_id.startsWith('tt')){
            //buscamos por id
            var url = "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY;
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
        }

    });


    //Funcion de autocomplete
    $("#search_term").keyup(function () {
        var that = this,
            value = $(this).val();

        if (value.length >= 3 ) {
            buscar_peliculas(value);
        }
    });


    function limpiar_form(){
        $('.form-alta #id').value = '';
        $('.form-alta .info-pelicula').remove();
    }

    $('.form-alta #id').change(function () {
        limpiar_form();
        if ($(this).val() !== '') {
            autocompletar_form($(this).val())
        }
    });
});
