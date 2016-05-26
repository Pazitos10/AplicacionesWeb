function goBack() {
    window.history.back();
}
$(document).ready(function () {
    var contenido = $('#cuerpo').val();
    $('#cuerpo-carta').empty();
    $('#cuerpo-carta').append(contenido);
});
