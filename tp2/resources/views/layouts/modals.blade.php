<script>
    /*
    *   TODO: encontrar una mejor solucion
    *   ==================================
    *   Las opciones que figuran dentro del menu del modal, varian de acuerdo a
    *   si se trata de plantillas, cartas o cartas publicas.
    *   Dado que estas se completan via js, es necesario comunicarle que opciones
    *   estan visibles.
    */
    var estoyEnCartasPublicas = false;
    var estoyEnCartas = false;
    var estoyEnPlantillas = false;
</script>
<div class="modal fade" id="modalMenu" tabindex="-1" role="dialog" aria-labelledby="myModalMenu">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title custom-header custom-header-sm text-center" id="myModalMenu">Opciones</h4>
            </div>
            <div class="modal-body" style="overflow:hidden">
                <div class="col-xs-12">
                    <div class="list-group" id="actions-menu">
                        @if(Request::path() == 'carta/publicas')
                            <script>estoyEnCartasPublicas = true;</script>
                            <a href="" class="list-group-item" id="btn-vista-previa"><span class="glyphicon glyphicon-eye-open"></span> Vista Previa</a>
                            <a href="" id="btn-modal-pdf" class="list-group-item"><span class="glyphicon glyphicon-save"></span> Descargar pdf</a>
                        @endif

                        @if(Request::path() == 'carta')
                            <script>estoyEnCartas = true;</script>
                            <a href="" class="list-group-item" id="btn-vista-previa"><span class="glyphicon glyphicon-eye-open"></span> Vista Previa</a>
                            <a href="" class="list-group-item" id="btn-editar"><span class="glyphicon glyphicon-pencil"></span> Editar</a>
                            <a href="" class="list-group-item" id="btn-modal-pdf"><span class="glyphicon glyphicon-save"></span> Descargar pdf</a>
                            <a href="" class="list-group-item btn-mail btn-send-mail"><span class="glyphicon glyphicon-envelope"></span> Enviar por e-mail</a>
                            {{ Form::open(array('url' => '', 'id' => 'form-remove')) }}
                                {{ Form::hidden('_method', 'DELETE') }}
                                {{ Form::button('<i class="glyphicon glyphicon-remove"></i> Eliminar', array(
                                'type' => 'submit',
                                'title' => 'Eliminar la carta',
                                'class'=> 'list-group-item list-group-item-danger',
                                'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
                            }}
                            {{ Form::close() }}
                        @endif

                        @if(Request::path() == 'plantilla' || Request::path() == '/')
                            <script>estoyEnPlantillas = true;</script>
                            <a href="" class="list-group-item" id="btn-vista-previa"><span class="glyphicon glyphicon-eye-open"></span> Vista Previa</a>
                            <a href="" class="list-group-item" id="btn-editar"><span class="glyphicon glyphicon-pencil"></span> Editar</a>
                            {{ Form::open(array('url' => '', 'id' => 'form-remove')) }}
                                {{ Form::hidden('_method', 'DELETE') }}
                                {{ Form::button('<i class="glyphicon glyphicon-remove"></i> Eliminar', array(
                                'type' => 'submit',
                                'title' => 'Eliminar la plantilla',
                                'class'=> 'list-group-item list-group-item-danger',
                                'onclick'=>'return confirm("Estás seguro de eliminar la Plantilla?")'))
                            }}
                            {{ Form::close() }}
                        @endif
                    </div>
                </div>
            </div>
        </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="modalMail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog">
        {{ Form::open(array('url' => '', 'class' => 'form', 'method' => 'post', 'id' => 'form-send-mail')) }}
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title custom-header custom-header-sm text-center" id="myModalLabel">Enviar por E-Mail</h4>
            </div>
            <div class="modal-body" style="overflow:hidden">
                <div class="col-xs-12">
                    <div class="form-group">
                        {!! Form::label('nombre_destinatario', 'Para:') !!}
                        {!! Form::text('destinatario', null, ['class' => 'form-control', 'placeholder' => 'Juan Lopez']) !!}
                    </div>
                    <div class="form-group">
                        {!! Form::label('to', 'Correo electronico:') !!}
                        {!! Form::email('email', null, ['class' => 'form-control', 'placeholder' => 'example@example.com']) !!}
                    </div>
                    <div class="form-group">
                        <hr class="custom-hr custom-hr-centered">
                        {{ Form::button('Enviar', array(
                            'type' => 'submit',
                            'title' => 'Enviar la carta por E-Mail',
                            'class'=> 'btn btn-sm btn-success lead btn-full-width'))
                        }}
                    </div>
                </div>

                {{ Form::close() }}
            </div>
        </div>
  </div>
</div>
<script type="text/javascript">
    $(document).ready(function(){
        $('.btn-send-mail').bind("click", function(e){
            e.preventDefault();
            var id = $('.btn-menu-responsive').data('id');
            var url = $(this)[0].href;
            if (! url.includes(id))
                url = $(this)[0].href + '/' + id + '/send_mail';
            console.log(url);
            $('#form-send-mail')[0].action = url;
        });
    });
</script>
