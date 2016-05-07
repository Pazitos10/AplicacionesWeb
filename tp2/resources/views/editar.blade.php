@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' });</script>
@section('content')

<!-- Bootstrap Boilerplate... -->

<div class="panel-body">
    <!-- Display Validation Errors -->
        @include('common.errors')
        
    <!-- Formulario para Nueva Plantilla -->
    <form action="{{ url('plantilla/edit/' .  $plantilla->id) }}" method="POST" class="form-horizontal">
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