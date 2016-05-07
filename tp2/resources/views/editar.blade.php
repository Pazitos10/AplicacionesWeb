@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' });</script>
@section('content')

<!-- Bootstrap Boilerplate... -->

<div class="panel-body">
    <!-- Display Validation Errors -->
        @include('common.errors')
        
    <!-- Formulario para Nueva Plantilla -->
    {!! Form::model($plantilla, [
        'method' => 'PUT',
        'route' => ['plantilla.update', $plantilla->id]
    ]) !!}
        {!! csrf_field() !!}

        <!-- Nombre de la Plantilla -->
        <div class="form-group">
            {!! Form::label('nombre', 'Nombre:', ['class' => 'control-label']) !!}
            {!! Form::text('nombre', null, ['class' => 'form-control']) !!}
        </div>
        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            {!! Form::label('cuerpo', 'Cuerpo:', ['class' => 'control-label']) !!}
            {!! Form::textarea('cuerpo', null, ['class' => 'form-control']) !!}
        </div>

        <!-- Guardar Plantilla -->
        {!! Form::submit('Guardar Cambios', ['class' => 'btn btn-primary']) !!}
    {!! Form::close() !!}
</div>
@endsection