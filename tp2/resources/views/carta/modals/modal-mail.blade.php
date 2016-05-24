
    <div class="modal fade" id="modalMail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
            {{ Form::open(array('url' => 'carta/' . $carta->id . '/send_mail', 'class' => 'form', 'method' => 'post')) }}
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
            </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
