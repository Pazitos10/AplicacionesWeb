$(document).ready(function(){

    //Definicion de funciones
    function generar_thumbnail(elemento, alto, ancho){
        html2canvas( elemento, {
            height: alto,
            width: ancho,
            onrendered: function(canvas) {
                submit_form(canvas);
            }
        });
    }

    function add_thumb_to_form(canvas){
        $('input[name=thumbnail]').val(canvas.toDataURL());
    }

    function add_placeholders_to_form(){
        var placeholders = {};
        var code_blocks = $('iframe').contents().find('body').find('code');
        for (var i=0; i < code_blocks.length ; i++) {
            content = String(code_blocks[i].innerHTML);
            placeholders[content] = content;
        }
        console.log(placeholders);
        $('input[name=placeholders]').val(JSON.stringify(placeholders));
    }


    function submit_form(canvas){
        add_thumb_to_form(canvas);
        add_placeholders_to_form();
        $('#form-plantilla').submit();
    }

    function mostrar_tabla() {
        $('#btn-listado').removeClass('active');
        $('#btn-tabla').addClass('active');
        $('#content-listado').hide();
        $('#content-tabla').show();
    }

    function mostrar_listado() {
        $('#btn-listado').addClass('active');
        $('#btn-tabla').removeClass('active');
        $('#content-listado').show();
        $('#content-tabla').hide();
    }

    //Event handling
    $('#btn-listado').click(function() {
        mostrar_listado();
    });

    $('#btn-tabla').click(function() {
        mostrar_tabla();
    });

    $('#btn-guardar').click(function(e){
        e.preventDefault();
        var contenido = $('iframe').contents().find('body');
        generar_thumbnail(contenido, 150, 250);
    });

    //Initialization
    mostrar_tabla();
});
