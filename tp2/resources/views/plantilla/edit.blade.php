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
    </form>
</div>
@endsection