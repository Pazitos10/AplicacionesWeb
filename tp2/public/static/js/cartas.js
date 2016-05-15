$(document).ready(function(){
    function set_label(value){
        $('#campo_id')[0].innerHTML = value;
    }

    function armar_form(data){
        var form = {};
        var inputs = [];
        var labels = [];
        $.each( data, function( key, value ) {
            labels.push(value);
            inputs.push("<input class='form-control' name='"+key+"' id='"+key+"' placeholder='"+value+"'>");
        });
        $('#dynamic-fields').empty();
        $('#dynamic-fields').append(inputs[0]);
        set_label(labels[0]);
        form.labels = labels;
        form.inputs = inputs;
        return form;
    }

    function fill_with_content(form, index) {
        $('#dynamic-fields').empty();
        $('#dynamic-fields').append(form.inputs[index]);
        set_label(form.labels[index]);
    }

    function handle_control_events(form) {
        var index = 0;
        $('#btn-next-field').click(function(){
            if (index < form.labels.length - 1)
                index += 1;
            else
                index = 0;
            fill_with_content(form, index);
        });

        $('#btn-prev-field').click(function(){
            if (index > 0)
                index -= 1;
            else
                index = form.labels.length - 1 ;
            fill_with_content(form, index);
        });

    }

    $('#plantilla_id').change(function(data) {
        $('.controls-container').show();
        var plantilla_id = data.target.value;
        $.ajax({
            url: './get_json_plantilla/'+plantilla_id,
            type: 'GET'
        }).done(function(data){
            var form = armar_form(JSON.parse(data));
            handle_control_events(form);
        })
    });

    $('.controls-container').hide();

});
