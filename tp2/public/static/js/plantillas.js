$(document).ready(function(){

    $('#btn-guardar').click(function(e){
        e.preventDefault();
        var contenido = $('iframe').contents().find('body');
        generar_thumbnail(contenido, 150, 300);
    });

    function generar_thumbnail(elemento, alto, ancho){
        html2canvas( elemento, {
            height: alto,
            width: ancho,
            onrendered: function(canvas) {
                postear_thumb(canvas);
            }
        });
    }

    function postear_thumb(canvas){
        $('input[name=thumbnail]').val(canvas.toDataURL());
        $('#nueva-plantilla').submit();
    }

    function mostrar_tabla() {
        $('#content-listado').hide();
        $('#content-tabla').show();
    }

    function mostrar_listado() {
        $('#content-listado').show();
        $('#content-tabla').hide();
    }

    $('#btn-listado').click(function() {
        mostrar_listado();
    });

    $('#btn-tabla').click(function() {
        mostrar_tabla();
    });

    mostrar_tabla();
});
