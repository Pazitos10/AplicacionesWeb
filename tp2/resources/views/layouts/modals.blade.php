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
                            <a href="" id="btn-modal-pdf" class="list-group-item"><span class="glyphicon glyphicon-save"></span> Descargar pdf</a>
                            <button type="button" class="list-group-item" id="btn-modal-mail" data-toggle="modal" data-target="#modalMail" data-id=""><span class="glyphicon glyphicon-envelope"></span> Enviar por e-mail</button>
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
