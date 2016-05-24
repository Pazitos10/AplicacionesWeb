$(document).ready(function(){
    function mostrar_modal_mail() {
        $('#modalMenuResponsive').modal('hide');
        $('#modalMail').modal('toggle');
    }
    function mostrar_modal_menu() {
        $('#modalMenuResponsive').modal('show');
    }

    $('.btn-mail').each(function () {
        $(this).bind('click', mostrar_modal_mail);
    })

    $('.btn-menu-responsive').each(function () {
        $(this).bind('click', mostrar_modal_menu);
    })
});
