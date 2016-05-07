@extends('layouts.app')
@section('content')

<!-- Bootstrap Boilerplate... -->

<div class="panel-body">
    <div class="jumbotron">
        <h1 class="text-center">Bienvenido al <b>Gestor de Plantillas</b></h1>
    </div>

    <!-- Plantillas Actualess -->
    @if (count($plantillas) > 0)
        <div class="panel panel-default">
            <div class="panel-heading">
                Plantillas Actuales
            </div>

            <div class="panel-body">
                <table class="table table-striped table-condensed">
                    <thead>
                        <th>Plantilla</th>
                        <th>Acciones</th>
                    </thead>
                    <tbody>
                        @foreach ($plantillas as $plantilla)
                            <tr>
                                <!-- Nombre -->
                                <td class="table-text">
                                    <div>{{ $plantilla->nombre }}</div>
                                </td>
                                <td>
                                    <a class="btn btn-small btn-default" href="{{ URL::to('plantilla/' . $plantilla->id) }}" title="Ver la plantilla"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                                    <a class="btn btn-small btn-default" href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}" title="Editar la plantilla"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @endif
</div>
@endsection