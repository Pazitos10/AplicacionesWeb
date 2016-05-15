@extends('layouts.app')
@section('content')

<!-- Bootstrap Boilerplate... -->
<div class="col-lg-10 col-lg-offset-1 col-xs-12">
    <!-- Plantillas Actualess -->
    <div class="list-wrapper">
        <div class="col-lg-12 col-xs-12">
            @if (count($plantillas) > 0)
            <h3 class="text-center">
                Plantillas Actuales
            </h3>
            <div class="btn-group btn-group-mostrar">
                <button id="btn-tabla" class="btn btn-default btn-sm" title="ver tabla"><span class="glyphicon glyphicon-th-list"></span></button>
                <button id="btn-listado" class="btn btn-default btn-sm" title="ver listado"><span class="glyphicon glyphicon-th"></span></button>
            </div>
            <div id="content-tabla">
                <table class="table table-striped table-condensed">
                    <thead>
                        <th>Nombre</th>
                        <th class="hidden-xs">Modificado</th>
                        <th class="text-right">Acciones</th>
                    </thead>
                    <tbody>
                        @foreach ($plantillas as $plantilla)
                            <tr>
                                <td>{{ $plantilla->nombre }}</td>
                                <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($plantilla->updated_at)) }}</td>
                                <td class="pull-right">
                                    <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $plantilla->id) }}" title="Ver la plantilla"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                                    <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}" title="Editar la plantilla"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                                    {{ Form::open(array('url' => 'plantilla/' . $plantilla->id, 'class' => 'form-inline')) }}
                                    {{ Form::hidden('_method', 'DELETE') }}
                                    {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                                        'type' => 'submit',
                                        'title' => 'Eliminar la plantilla',
                                        'class'=> 'btn btn-sm btn-danger',
                                        'onclick'=>'return confirm("Estás seguro de eliminar la Plantilla?")'))
                                    }}
                                    {{ Form::close() }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div id="content-listado">
                <div class="row list-wrapper">
                    @foreach ($plantillas as $plantilla)
                        <div class="col-md-3 item">
                            <a href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}">
                                @if (isset($plantilla->thumbnail))
                                    <img class="img-responsive thumb" src="{{ $plantilla->thumbnail }}" alt="">
                                @else
                                    <img class="img-responsive thumb" src="http://placehold.it/700x400" alt="" />
                                @endif
                            </a>
                            <!-- <div class="btn-group categorias">
                                <a href="#" title="Queja" class="btn btn-warning btn-xs disabled">Queja</a>
                                <a href="#" title="Pública" class="btn btn-info btn-xs disabled">Pública</a>
                            </div> -->
                            <div class="btn-group btn-item-options">
                                <a href="#" title="Ver" class=""><span class="glyphicon glyphicon-eye-open btn-on-item"></span></a>
                                <a href="#" title="Eliminar" class=""><span class="glyphicon glyphicon-remove btn-on-item icon-remove"></span></a>
                            </div>
                            <h4 class="nombre-plantilla">
                                <a href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}">{{ $plantilla->nombre }}</a>
                            </h4>
                        </div>
                    @endforeach
                </div>
                <!-- /.row -->

                <hr>

                <!-- Pagination -->
                <div class="row text-center">
                    <div class="col-lg-12">
                        <ul class="pagination">
                            <li>
                                <a href="#">&laquo;</a>
                            </li>
                            <li class="active">
                                <a href="#">1</a>
                            </li>
                            <li>
                                <a href="#">2</a>
                            </li>
                            <li>
                                <a href="#">3</a>
                            </li>
                            <li>
                                <a href="#">4</a>
                            </li>
                            <li>
                                <a href="#">&raquo;</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- /.row -->

                <hr>
                <footer>
                    <div class="row">
                        <div class="col-lg-12">
                            <p>Copyright &copy; Iglesias Matias - Pazos Bruno - 2016</p>
                        </div>
                    </div>
                    <!-- /.row -->
                </footer>
            </div>
            @else
                <h3 class="text-muted">
                    <strong>No tienes plantillas para mostrar. Crea una por medio de Plantillas -> Crear.</strong>
                </h3>

            @endif
        </div>
    </div>

</div>

@endsection
