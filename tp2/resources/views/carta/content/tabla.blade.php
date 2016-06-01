<div id="content-tabla">
    <table class="table table-striped table-condensed">
        <thead>
            <th>Titulo</th>
            <th class="hidden-xs">Modificado</th>
            <th class="text-right">Acciones</th>
        </thead>
            <tbody>
                @foreach ($cartas as $carta)
                    <tr>
                        @if(Request::path() == 'carta/publicas')
                            <td>
                                {{ $carta->nombre }}
                            </td>
                            <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                            <td class="pull-right">
                                <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/public' ) }}" title="Ver la carta"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                                <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_public_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save"></span></a>
                            </td>
                        @else
                            <td>
                                {{ $carta->nombre }}
                                @if(!($carta->publica))
                                    <span class="glyphicon glyphicon-lock" title="carta privada"></span>
                                @endif
                            </td>
                            <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                            <td class="pull-right hidden-xs">
                                <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta">
                                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                                </a>
                                <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf">
                                    <span class="glyphicon glyphicon-save"></span>
                                </a>
                                <!-- <button type="button" class="btn btn-sm btn-primary btn-mail" id="btn-send-mail" title="Enviar por email" data-id="{{$carta->id}}"> -->
                                <a href="{{ URL::to('carta/' . $carta->id . '/send_mail') }}" class="btn btn-sm btn-primary btn-mail" id="btn-send-mail" title="Enviar por email" data-id="{{$carta->id}}">
                                @if(Request::path() != 'carta/publicas')
                                        <span class="glyphicon glyphicon-envelope"></span>
                                    </button>
                                    <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/edit') }}" title="Editar la carta">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </a>
                                    {{ Form::open(array('url' => 'carta/' . $carta->id, 'class' => 'form-inline')) }}
                                    {{ Form::hidden('_method', 'DELETE') }}
                                    {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                                        'type' => 'submit',
                                        'title' => 'Eliminar la carta',
                                        'class'=> 'btn btn-sm btn-danger',
                                        'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
                                    }}
                                    {{ Form::close() }}
                                @endif
                            </td>
                            <td class="pull-right visible-xs">
                                <button class="btn btn-xs btn-info btn-menu-responsive" data-id="{{$carta->id}}">
                                    <span class="glyphicon glyphicon-menu-hamburger"></span>
                                </button>
                            </td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
    </table>
</div>
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
        $('#btn-send-mail').click(function(e){
            e.preventDefault();
            console.log('ehh', $(this)[0], $(this)[0].href);
            var url = $(this)[0].href;
            $('#form-send-mail')[0].action = url;
            console.log($('#form-send-mail')[0].action);
        });
    });
</script>
