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
    * Devuelve la URL con la imagen de poster de la pelicula
    * @param String imdb_id Id de IMDB
    * @param String img_id Id del objeto IMG
    */
    function buscar_info_pelicula(imdb_id){
        var API_KEY = "53eb1914f7a9090c92553339f74280ce";
        $.ajax({
            url: "https://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=" + API_KEY,
            method: "GET"
            })
            .done(function( data ) {
                console.log(data);
                //poster
                $("#portada-id").attr("src", "http://image.tmdb.org/t/p/w150" + data.poster_path);

                //titulo
                $("#title-display").text(data.original_title);
                $("#title").attr("value",data.original_title);

                //Genero
                var genres = '';
                for (var i in data.genres) {
                    if (genres !== ''){
                        genres += $("#genre-display").val() + " | " +data.genres[i].name;
                    }else {
                        genres += data.genres[i].name;
                    }
                }
                console.log(genres);
                $("#genre-display").text(genres);
                $("#genre").attr('value', genres);

                //Año
                var anio = new Date(String(data.release_date)).getFullYear();
                $("#year-display").text(anio);
                $("#year").attr("value", anio);

                //Rating
                var rating = data.vote_average;
                if(rating > 5.0){
                    rating = 5.0;
                }
                $('#rating').rating('rate', rating);

            });
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

    function autocompletar_form(){
        buscar_info_pelicula($('#id').val(), 'portada-id');
    }


    $('.form-alta #id').change(function () {
        if ($(this).val() !== '') {
            autocompletar_form()}
    });
});
