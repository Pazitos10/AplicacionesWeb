$(document).ready(function(){

    /*
    *   Verifica que acciones es posible realizar segun el contenido del cuerpo
    *   y habilita los botones correspondientes
    */
    function verificar_acciones() {
        if( $('#cuerpo-carta').is(':empty') ) {
            $('#btn-guardar-carta').addClass('disabled');
            $('#btn-guardar-carta').prop('disabled', true);
            $('#btn-vista-previa').addClass('disabled');
            $('#btn-pdf').addClass('disabled');
            $('#btn-mail').addClass('disabled');
        }else{
            $('#btn-guardar-carta').removeClass('disabled');
            $('#btn-guardar-carta').prop('disabled', false);
            $('#btn-vista-previa').removeClass('disabled');
            $('#btn-pdf').removeClass('disabled');
            $('#btn-mail').removeClass('disabled');
        }
    }


    /*
    *   Setea el label del campo dinamico con el valor indicado
    */
    function set_label(value, index, total){
        var label = value + " (" + index + "/" + total + " )" ;
        $('#campo_id')[0].innerHTML = label;
    }

    function completar_valores(element_id, value){
        /*TODO: hacer el data binding de los datos introducidos
        *      con los datos del cuerpo de la carta
        */
        console.log(element_id, value);
    }


    /*
    *   Pide por ajax, informacion referente a la plantilla seleccionada
    */
    function make_ajax_request(data) {
        var plantilla_id = data.target.value;
        $.ajax({
            url: './get_json_plantilla/'+plantilla_id,
            type: 'GET'
        }).done(function(data){
            var form = armar_form(JSON.parse(data));
            handle_control_events(form);
        })
    }

    /*
    *   Carga el cuerpo de la carta, segun la plantilla seleccionada.
    */
    function mostrar_cuerpo(cuerpo) {
        $('#cuerpo-carta').empty();
        $('#cuerpo-carta').append(cuerpo);
        verificar_acciones();
    }

    /*
    *   Agrega los inputs de campos dinamicos al DOM
    */
    function agregar_campos(form) {
        set_label(form.labels[0], 1, form.labels.length);
        $('#dynamic-fields').empty();
        for (var i = 0; i < form.inputs.length; i++){
            $('#dynamic-fields').append(form.inputs[i]);
        }
        mostrar_campo(0);
    }

    /*
    *   Hace visible en el DOM al input del campo seleccionado
    *   y oculta los demas.
    */
    function mostrar_campo(index) {
        $('#dynamic-fields input').each(function(i, input){
            $(this).hide();
            if (i == index){
                $(this).show();
            }
        })

        $('#dynamic-fields input').keydown(function (){
            completar_valores($(this).prop('id'), $(this).val());
        });
    }


    /*
    * Completa el formulario con la informacion pedida al servidor.
    */
    function armar_form(data){
        var form = { labels: [], inputs: []};
        var placeholders = data["placeholders"];
        var cuerpo = data["cuerpo"];
        $.each( placeholders, function( key, value ) {
            form.labels.push(value);
            form.inputs.push("<input class='form-control' name='"+key+"' id='"+key+"' placeholder='"+value+"'>");
        });
        agregar_campos(form);
        mostrar_cuerpo(cuerpo);
        return form;
    }

    /*
    *   Carga el nombre del campo dinamico y agrega
    *   el input que corresponde al formulario
    */
    function fill_with_content(form, index) {
        mostrar_campo(index);
        set_label(form.labels[index], index+1, form.labels.length);
    }

    /*
    *   Verifica los eventos de los controles del carousel
    *   para los campos dinamicos.
    */
    function handle_control_events(form) {
        var index = 0;
        $('#btn-next-field').click(function(e){
            e.preventDefault();
            if (index < form.labels.length - 1)
                index += 1;
            else
                index = 0;
            fill_with_content(form, index);
        });

        $('#btn-prev-field').click(function(e){
            e.preventDefault(); // to avoid annoying jumps
            if (index > 0)
                index -= 1;
            else
                index = form.labels.length - 1 ;
            fill_with_content(form, index);
        });

    }

    //Event Handling
    $('#plantilla_id').change(function(data) {
        $('.controls-container').show();
        make_ajax_request(data);
    });

    //Inicialization
    $('.controls-container').hide();
    $('#cuerpo-carta').empty();
    verificar_acciones();
});
