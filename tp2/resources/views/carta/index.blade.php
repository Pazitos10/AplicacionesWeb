<!-- app/views/carta/index.blade.php -->
@extends('home')
@section('dynamic-content')

    @if (count($cartas) > 0)
    <h3 class="text-center custom-header">Cartas Actuales</h3>
    <hr>
    <div class="btn-group btn-group-mostrar">
        <button id="btn-tabla" class="btn btn-default btn-sm" title="ver tabla"><span class="glyphicon glyphicon-th-list"></span></button>
        <button id="btn-listado" class="btn btn-default btn-sm" title="ver listado"><span class="glyphicon glyphicon-th"></span></button>
    </div>
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
                        <td>
                            {{ $carta->nombre }}
                            @if(!($carta->publica))
                                <span class="glyphicon glyphicon-lock" title="carta privada"></span>
                            @endif
                        </td>
                        <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                        <td class="pull-right hidden-xs">
                            <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                            <button type="button" class="btn btn-sm btn-primary" id="btn-mail" title="Enviar por email"><span class="glyphicon glyphicon-envelope"></span></button>
                            <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save"></span></a>
                            <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/edit') }}" title="Editar la carta"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                            {{ Form::open(array('url' => 'carta/' . $carta->id, 'class' => 'form-inline')) }}
                            {{ Form::hidden('_method', 'DELETE') }}
                            {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                                'type' => 'submit',
                                'title' => 'Eliminar la carta',
                                'class'=> 'btn btn-sm btn-danger',
                                'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
                            }}
                            {{ Form::close() }}
                        </td>
                        <td class="pull-right visible-xs">
                            <button class="btn btn-xs btn-info" id="btn-menu-responsive"><span class="glyphicon glyphicon-menu-hamburger"></span></button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div id="content-listado">
        <div class="row list-wrapper">
            @foreach ($cartas as $carta)
                <div class="col-md-3 item">
                    <a href="{{ URL::to('carta/' . $carta->id . '/edit') }}">
                        @if (isset($carta->thumbnail))
                            <div class="crop">
                                <img class="thumb-cartas" src="{{ $carta->thumbnail }}" alt="">
                            </div>
                        @else
                            <img class="img-responsive" src="http://placehold.it/700x400" alt="" />
                        @endif
                    </a>
                    <!-- <div class="btn-group categorias">
                        <a href="#" title="Queja" class="btn btn-warning btn-xs disabled">Queja</a>
                        <a href="#" title="Pública" class="btn btn-info btn-xs disabled">Pública</a>
                    </div> -->
                    <div class="btn-group btn-item-options">
                        <a href="{{ URL::to('carta/' . $carta->id . '/send_mail') }}" id="btn-mail" title="Enviar por email"><span class="glyphicon glyphicon-envelope btn-on-item hidden-xs"></span></a>
                        <a href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save btn-on-item hidden-xs"></span></a>
                        <a href="{{ URL::to('carta/' . $carta->id) }}" title="Ver" ><span class="glyphicon glyphicon-eye-open btn-on-item hidden-xs"></span></a>
                        <a href="{{ URL::to('carta/' . $carta->id . '/destroy') }}" title="Eliminar" ><span class="glyphicon glyphicon-remove btn-on-item icon-remove hidden-xs"></span></a>
                    </div>
                    <h4 class="nombre-carta">
                        @if(! $carta->publica)
                            <div class="item-footer">
                                <span title="carta privada" class="glyphicon glyphicon-lock btn-sm pull-left"></span>
                                {{ $carta->nombre }}
                                <button type="button" id="btn-item-menu-responsive" class="btn btn-xs"><span class="glyphicon glyphicon-menu-hamburger visible-xs"></span></button>
                            </div>
                        @else
                            <div class="item-footer">
                                {{ $carta->nombre }}
                                <button type="button" id="btn-item-menu-responsive" class="btn btn-xs"><span class="glyphicon glyphicon-menu-hamburger visible-xs"></span></button>
                            </div>
                        @endif
                    </h4>
                </div>
            @endforeach
        </div>
        <!-- /.row -->
    </div>
    @else
        <h3 class="text-muted">
            <strong>No tienes cartas para mostrar. Crea una por medio de Cartas -> Crear.</strong>
        </h3>

    @endif

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

    <div class="modal fade" id="modalMenuResponsive" tabindex="-1" role="dialog" aria-labelledby="myModalMenuResponsive">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title custom-header custom-header-sm text-center" id="myModalMenuResponsive">Opciones</h4>
                </div>
                <div class="modal-body" style="overflow:hidden">
                    <div class="col-xs-12">
                        <div class="list-group">
                            <a href="{{URL::to('./carta/'. $carta->id )}}" class="list-group-item"><span class="glyphicon glyphicon-eye-open"></span> Vista Previa</a>
                            <button type="button" class="list-group-item" id="btn-item-mail"><span class="glyphicon glyphicon-envelope"></span> Enviar por e-mail</button>
                            <a href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" class="list-group-item"><span class="glyphicon glyphicon-save"></span> Descargar pdf</a>
                            <a href="{{ URL::to('carta/' . $carta->id . '/edit') }}" class="list-group-item"><span class="glyphicon glyphicon-pencil"></span> Editar</a>
                            {{ Form::open(array('url' => 'carta/' . $carta->id)) }}
                            {{ Form::hidden('_method', 'DELETE') }}
                            {{ Form::button('<i class="glyphicon glyphicon-remove"></i> Eliminar', array(
                                'type' => 'submit',
                                'title' => 'Eliminar la carta',
                                'class'=> 'list-group-item list-group-item-danger',
                                'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
                            }}
                            {{ Form::close() }}

                        </div>
                    </div>
                </div>
            </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <script type="text/javascript">
        $(document).ready(function(){
            $('#btn-mail').click(function () {
                $('#modalMenuResponsive').modal('hide');
                $('#modalMail').modal('toggle');
            });

            $('#btn-item-mail').click(function () {
                $('#modalMenuResponsive').modal('hide');
                $('#modalMail').modal('toggle');
            });

            $('#btn-menu-responsive').click(function () {
                $('#modalMenuResponsive').modal('toggle');
            });

            $('#btn-item-menu-responsive').click(function () {
                $('#modalMenuResponsive').modal('toggle');
            });
        });
    </script>

@endsection
