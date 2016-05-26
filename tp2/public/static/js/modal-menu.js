$(document).ready(function(){

    /*
    *   Vacia los campos con referencias a urls del servidor
    */
    function limpiar_urls() {
        $('#actions-menu a').each(function(){
            $(this).href='';
        });
        $('#actions-menu #form-remove').each(function(){
            $(this).action = '';
        });
    }

    /*
    *   Completa las URLs con los valores correspondientes segun se
    *   invoque al modal desde plantillas, cartas o cartas publicas
    */
    function modificar_urls(id) {
        limpiar_urls();
        if(estoyEnPlantillas){
            $('#btn-vista-previa')[0].href = 'plantilla/' + id;
            $('#btn-editar')[0].href =  'plantilla/' + id + '/edit';
            $('#form-remove')[0].action = 'plantilla/' + id ;
        }

        if(estoyEnCartas){
            $('#btn-editar')[0].href =  'carta/' + id + '/edit';
            $('#form-remove')[0].action = 'carta/' + id ;
            $('#btn-modal-mail').data('id', id);
            $('#btn-vista-previa')[0].href = 'carta/' + id;
            $('#btn-modal-pdf')[0].href += '/' + id + '/get_pdf';
        }

        if(estoyEnCartasPublicas){
            $('#btn-vista-previa')[0].href = id;
            $('#btn-modal-pdf')[0].href = id + '/get_pdf';
        }
    }

    /*
    *   Muestra el modal para completar datos de envio por e-mail
    */
    function mostrar_modal_mail() {
        $('#modalMenuResponsive').modal('hide');
        $('#modalMail').modal('toggle');
    }

    /*
    *   Muestra un menu de opciones dentro de un modal.
    *   Las opciones se configuran segun se trate de plantillas,
    *   cartas o cartas publicas.
    */
    function mostrar_modal_menu() {
        modificar_urls($(this).data('id'));
        $('#modalMenu').modal('show');
    }

    //Event Handling
    $('.btn-mail').each(function () {
        $(this).bind('click', mostrar_modal_mail);
    });

    $('.btn-menu-responsive').each(function () {
        $(this).bind('click', mostrar_modal_menu);
    });
});
