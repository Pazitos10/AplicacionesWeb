<!-- app/views/plantilla/edit.blade.php -->
@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' });</script>
@section('content')

<div class="container">
    <h1>Editar Plantilla</h1>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')

    <form action="{{ url('plantilla') }}" method="PUT" class="form-horizontal">
        {!! csrf_field() !!}

                <!-- Nombre de la Plantilla -->
        <div class="form-group">
            <label for="nombre" class="col-sm-3 control-label">Nombre</label>
            <div class="col-sm-6">
                <input type="text" name="nombre" id="plantilla-nombre" class="form-control" value="{{ $plantilla->nombre }}">
            </div>
        </div>
        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            <label for="cuerpo" class="col-sm-3 control-label">Cuerpo</label>
            <div class="col-sm-6">
                <textarea name="cuerpo" id="plantilla-cuerpo" class="form-control">{{ $plantilla->cuerpo }}</textarea>
            </div>
        </div>

        <!-- Guardar Plantilla -->
        <div class="form-group">
            <div class="col-sm-offset-3 col-sm-6">
                <button type="submit" class="btn btn-default">
                    <i class="fa fa-plus"></i> Guardar Cambios
                </button>
            </div>
        </div>
    </form>
</div>
@endsection