<!-- app/views/carta/index.blade.php -->
@extends('home')
@section('dynamic-content')
    @if (count($cartas) > 0)
        <h3 class="text-center custom-header">
            @if(Request::path() != 'carta/publicas')
                Cartas Actuales
            @else
                Cartas Públicas
            @endif
        </h3>
        <hr>
        <div class="btn-group btn-group-mostrar">
            <button id="btn-tabla" class="btn btn-default btn-sm" title="ver tabla"><span class="glyphicon glyphicon-th-list"></span></button>
            <button id="btn-listado" class="btn btn-default btn-sm" title="ver listado"><span class="glyphicon glyphicon-th"></span></button>
        </div>
        @include('carta.content.tabla', ['cartas' => $cartas])
        @include('carta.content.listado', ['cartas' => $cartas])
    @else
        <h3 class="text-muted text-center">
            <strong>
                @if(Request::path() != 'carta/publicas')
                    <p>No tienes cartas para mostrar. Crea una por medio de Cartas -> Crear.</p>
                @else
                    <p>No hay cartas públicas para mostrar.</p>
                    <p>Crea una por medio de Cartas -> Crear o edita una de tus cartas, y activa el campo pública.</p>
                @endif
            </strong>
        </h3>
    @endif

    @include('layouts.modals')


@endsection
