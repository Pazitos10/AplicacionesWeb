<!-- app/views/carta/index.blade.php -->
@extends('home')
@section('dynamic-content')

    @if (count($cartas) > 0)
    <h3 class="text-center">
        Cartas Actuales
    </h3>
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
                        <td>{{ $carta->nombre }}</td>
                        <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                        <td class="pull-right">
                            <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $carta->id) }}" title="Ver la plantilla"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                            <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $carta->id . '/edit') }}" title="Editar la plantilla"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
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
                            <img class="img-responsive thumb" src="{{ $carta->thumbnail }}" alt="">
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
                        {{ $carta->nombre }}
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
    </div>
    @else
        <h3 class="text-muted">
            <strong>No tienes cartas para mostrar. Crea una por medio de Cartas -> Crear.</strong>
        </h3>

    @endif

@endsection
