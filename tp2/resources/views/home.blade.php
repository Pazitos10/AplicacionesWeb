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
                <div class="row">
                    @foreach ($plantillas as $plantilla)
                        <div class="col-md-4 portfolio-item">
                            <a href="#">
                                @if (isset($plantilla->thumbnail))
                                    <img class="img-responsive thumb" src="{{ $plantilla->thumbnail }}" alt="">
                                @else
                                    <img class="img-responsive thumb" src="http://placehold.it/700x400" alt="" />
                                @endif
                            </a>
                            <div class="btn-group categorias">
                                <a href="#" title="Queja" class="btn btn-warning btn-xs disabled">Queja</a>
                                <a href="#" title="Pública" class="btn btn-info btn-xs disabled">Pública</a>
                            </div>
                            <h3>
                                <a href="#">{{ $plantilla->nombre }}</a>
                            </h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
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
            @endif
        </div>
    </div>

</div>

@endsection
