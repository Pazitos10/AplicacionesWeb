$(document).ready(function(){

    var Carta = Backbone.Model.extend({
        regex: /<\s*code.*?>(\w+)<\/code>/g,
        initialize: function() {
        },
        template: function() {
            var c = this.get("cuerpo");
            var prompt = "";
            var name = $('#dynamic-fields input:visible').prop('name');
            if (c){
                prompt = "<span id='"+name+"' class='fake-prompt'></span>";
                return _.template(c.replace(this.regex, "<span class='replacement'><%=  $1 %>"+ prompt+"</span>"));
            }
        }
    });

    var CartaView = Backbone.View.extend({
        el: '#cuerpo-carta',
        initialize: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'change', this.render);
            setInterval(function(){
                var name = $('#dynamic-fields input:visible').prop('name');
                $('#'+name + ".fake-prompt").fadeOut();
                $('#'+name + ".fake-prompt").fadeIn();
            },1000);
        },
        render: function() {
            this.$el.empty();
            var t = this.model.template();
            if (t)
                this.$el.append(t(this.model.toJSON()));
            return this.$el;
        }
    });

    function downloadPDF() {
        var nombre_archivo = $('#nombre_carta') + ".pdf";
        $.ajax({
            url: './descargar/' + nombre_archivo,
            type: 'GET'
        }).done(function(data){
            window.location = 'descargar/';
            console.log("descarga exitosa");
        }).fail(function(data){
            console.log("error al descargar");
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
    *   Verifica que acciones es posible realizar segun el contenido del cuerpo
    *   y habilita los botones correspondientes
    */
    /*function verificar_acciones() {
        var buttons = [ '#btn-guardar-carta',
                        '#btn-vista-previa',
                        '#btn-pdf',
                        '#btn-mail'
                    ];
        if( $('#cuerpo-carta').is(':empty') ) {
            for (var button in buttons) {
                $(button).addClass('disabled');
            }
        }else{
            for (var button in buttons) {
                $(button).removeClass('disabled');
            }
        }
    }*/


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
        miCarta = new Carta();
        miCartaView = new CartaView({model: miCarta});
            $.ajax({
                url: './get_json_plantilla/'+plantilla_id,
                type: 'GET'
            }).done(function(data){
                if(!carta_id){
                    armar_form(JSON.parse(data), miCarta, miCartaView);
                    handle_control_events(miCarta);
                }else{
                    var placeholders = JSON.parse($('#placeholders').val());
                    var data = { cuerpo: JSON.parse(data)['cuerpo'], placeholders: placeholders }
                    armar_form(data, miCarta, miCartaView);
                    handle_control_events(miCarta);
                }
            })
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
                model.set(value, $(this).val());
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
    }

    /*
    *   Verifica los eventos de los controles del carousel
    *   para los campos dinamicos.
    */
    function handle_control_events(model) {
        var labels = Object.keys(model.attributes)
        labels.pop('cuerpo');
        var index = 0;
        if (labels.length === 1) {
            $('#btn-next-field').addClass('disabled');
            $('#btn-prev-field').addClass('disabled');
        }else{
            $('#btn-next-field').removeClass('disabled');
            $('#btn-prev-field').removeClass('disabled');
            $('#btn-next-field').click(function(e){
                e.preventDefault();
                if (index < labels.length - 1)
                    index += 1;
                else
                    index = 0;
                fill_with_content(index, labels);
            });

            $('#btn-prev-field').click(function(e){
                e.preventDefault(); // to avoid annoying jumps
                if (index > 0)
                    index -= 1;
                else
                    index = labels.length - 1 ;
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
        $('#cuerpo').val(miCarta.get('cuerpo'));
        $('#placeholders').val(JSON.stringify(get_placeholders(miCarta)));
        $('#form-carta').submit();
    });

    $('#btn-pdf').click(function (e) {
        downloadPDF();
    })

    //Inicialization
    var miCarta = miCarta | new Carta();
    var miCartaView = miCartaView | new CartaView({model: miCarta});
    $('#plantilla_id').trigger('change');
});
