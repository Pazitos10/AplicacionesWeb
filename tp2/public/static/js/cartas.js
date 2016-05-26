$(document).ready(function(){

    var Carta = Backbone.Model.extend({
        regex: /<\s*code.*?>(\w+)<\/code>/g,
        initialize: function() {
        },
        template: function() {
            var c = this.get("cuerpo");
            var name = $('#dynamic-fields input:visible').prop('name');
            if (c){
                return _.template(c.replace(this.regex, "<span class='replacement' id='$1'><%= $1 %></span>"));
            }
        }
    });

    var CartaView = Backbone.View.extend({
        el: '#cuerpo-carta',
        initialize: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            this.$el.empty();
            var t = this.model.template();
            if (t){
                this.$el.append(t(this.model.toJSON()));
            }
            return this.$el;
        }
    });

    function get_thumbnail(target){
        html2canvas( target , {
            onrendered: function(canvas) {
                $('#thumbnail').val(canvas.toDataURL("image/png"));
                $('#form-carta').submit();
            }
        });
    }


    /*
    *   Obtiene los valores ingresados en los placeholders
    *   y retorna un objeto JSON con dichos valores.
    */
    function get_placeholders(model) {
        var placeholders = {};
        var placeholder_values = Object.keys(model.attributes);
        placeholder_values.pop('cuerpo');
        for (var i=0; i < placeholder_values.length; i++) {
            placeholders[placeholder_values[i]] = model.get(placeholder_values[i]);
        }
        return placeholders;
    }

    /*
    *   Setea el valor del switch de carta publica,
    *   basado en su valor en el modelo.
    */
    function set_publica(){
        var isPublic = Number($('#custom-switch').data("checked"));
        if (isPublic != 0){
            $('#custom-switch').attr('checked', 'checked') ;
        }else{
            $('#custom-switch').removeAttr('checked');
        }
    }


    /*
    *   Setea el label del campo dinamico con el valor indicado
    */
    function set_label(value, index, total){
        var label = value + " (" + index + "/" + total + " )" ;
        $('#campo_id')[0].innerHTML = label;
    }


    /*
    *   Pide por ajax, informacion referente a la plantilla seleccionada
    */
    function make_ajax_request(data) {
        var plantilla_id = data.target.value;
        var carta_id = $('#carta_id').val();
        $.ajax({
            url: './get_json_plantilla/'+plantilla_id,
            type: 'GET'
        }).done(function(data){
            miCarta = new Carta();
            miCartaView = new CartaView({model: miCarta});
            if(!carta_id){
                armar_form(JSON.parse(data), miCarta, miCartaView);
                handle_control_events(miCarta);
            }else{
                var placeholders = JSON.parse($('#placeholders').val());
                var custom_data = { cuerpo: JSON.parse(data)["cuerpo"], placeholders: placeholders }
                armar_form(custom_data, miCarta, miCartaView);
                handle_control_events(miCarta);
            }
            set_publica();
        })
    }

    /*
    * Resalta el campo a completar en el cuerpo de la carta
    */
    function highlight_field() {
        var name_visible = $('#dynamic-fields input:visible').prop('name');
        $('#'+name_visible+'.replacement').addClass('active');
        var invisibles = $('#dynamic-fields input:hidden');
        $.each(invisibles, function (index, value) {
            var name_invisible = $(value).prop('name');
            $('#'+name_invisible+'.replacement').removeClass('active');
        });
    }


    /*
    *   Agrega los inputs de campos dinamicos al DOM
    */
    function agregar_campos(input) {
        var labels = Object.keys(miCarta.attributes);
        set_label(labels[0], 1, labels.length);
        $('#dynamic-fields').append(input);
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

    }


    /*
    * Completa el formulario con la informacion pedida al servidor.
    */
    function armar_form(data, model, view){
        var placeholders = data["placeholders"];
        $('#dynamic-fields').empty();
        $.each( placeholders, function( key, value ) {
            model.set(key, value);
            var $input = $("<input class='form-control' name='"+key+"' id='"+key+"' placeholder='"+value+"' value='"+value+"' maxlength='30'>");
            $input.on("keyup", function() {
                model.set(key, $(this).val());
            });
            agregar_campos($input);
        });
        model.set("cuerpo", data["cuerpo"]);
        view.render();

    }

    /*
    *   Carga el nombre del campo dinamico y agrega
    *   el input que corresponde al formulario
    */
    function fill_with_content(index, labels) {
        mostrar_campo(index);
        set_label(labels[index], index+1, labels.length);
        highlight_field();
    }

    /* Deshabilita los controles <- -> en el formulario*/
    function disable_controls() {
        $('#btn-next-field').addClass('disabled');
        $('#btn-prev-field').addClass('disabled');
    }

    /* Habilita los controles <- -> en el formulario*/
    function enable_controls() {
        $('#btn-next-field').removeClass('disabled');
        $('#btn-prev-field').removeClass('disabled');
    }

    /* Permite avanzar y mostrar el campo dinamico */
    function next_field(index, fields_qty) {
        if (index < fields_qty - 1)
            index += 1;
        else
            index = 0;
        return index;
    }

    /* Permite retroceder y mostrar el campo dinamico */
    function prev_field(index, fields_qty) {
        if (index > 0)
            index -= 1;
        else
            index = fields_qty - 1 ;
        return index;
    }


    /*
    *   Verifica los eventos de los controles del carousel
    *   para los campos dinamicos.
    */
    function handle_control_events(model) {
        var labels = Object.keys(model.attributes)
        labels.pop('cuerpo');
        var index = 0;
        highlight_field();
        if (labels.length === 1) {
            disable_controls();
        }else{
            enable_controls();
            $('#btn-next-field').click(function(e){
                e.preventDefault();
                index = next_field(index, labels.length);
                fill_with_content(index, labels);
            });

            $('#btn-prev-field').click(function(e){
                e.preventDefault(); // to avoid annoying jumps
                index = prev_field(index, labels.length);
                fill_with_content(index, labels);
            });
        }
    }

    //Event Handling
    $('#plantilla_id').change(function(data) {
        $('.controls-container').show();
        make_ajax_request(data);
    });

    $('#btn-guardar-carta').click(function(e) {
        e.preventDefault();
        $('#cuerpo').val($('#cuerpo-carta')[0].innerHTML);
        $('#placeholders').val(JSON.stringify(get_placeholders(miCarta)));
        get_thumbnail($('#cuerpo-carta')[0]);
    });

    //Inicialization
    var miCarta = miCarta | new Carta();
    var miCartaView = miCartaView | new CartaView({model: miCarta});
    $('#plantilla_id').trigger('change');
});
