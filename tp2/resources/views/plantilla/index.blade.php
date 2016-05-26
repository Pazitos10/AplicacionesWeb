<!-- app/views/plantilla/index.blade.php -->
@extends('home')
@section('dynamic-content')

    @if (count($plantillas) > 0)
        <h3 class="text-center custom-header">Plantillas Actuales</h3>
        <hr>
        <div class="btn-group btn-group-mostrar">
            <button id="btn-tabla" class="btn btn-default btn-sm" title="ver tabla"><span class="glyphicon glyphicon-th-list"></span></button>
            <button id="btn-listado" class="btn btn-default btn-sm" title="ver listado"><span class="glyphicon glyphicon-th"></span></button>
        </div>
        @include('plantilla.content.tabla', ['plantillas' => $plantillas])
        @include('plantilla.content.listado', ['plantillas' => $plantillas])
    @else
        <h3 class="text-muted text-center">
            <strong>No tienes plantillas para mostrar. Crea una por medio de Plantillas -> Crear.</strong>
        </h3>
    @endif
    @include('layouts.modals')
@endsection
