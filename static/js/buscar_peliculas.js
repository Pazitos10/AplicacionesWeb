$(document).ready(function () {
    function buscar_peliculas(search_term) {
        $.ajax({
                url: "api.php/movies?term=" + search_term,
                method: "GET"
            })
            .done(function( data ) {
                return data;
            });
    }

    function mostrar_peliculas(peliculas, search_term) {
        if (peliculas == undefined) {
            $(document).trigger("add-alerts", {
                message: "No se encontraron Peliculas con Id o Titulo " + search_term,
                priority: "warning"
            });
        }
    }

    $("#search").click(function () {
        var search_term = $("#movie_id").val();
        if (search_term.length == 0) {
            $(document).trigger("add-alerts", {
                message: "Por favor, ingrese el Id de la pelicula",
                priority: "error"
            });
            $("#movie_id").focus();
        } else {
            peliculas = buscar_peliculas(search_term);
            mostrar_peliculas(peliculas, search_term);
        }


    });
});