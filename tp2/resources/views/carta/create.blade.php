<!-- app/views/carta/create.blade.php -->
@extends('layouts.app')

@section('content')

<div class="col-lg-10 col-lg-offset-1">

    <h3 class="text-center">Crear Nueva Carta</h3>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')


    {{ Form::open(array('url' => 'carta/', 'id' => 'form-carta'))  }}
    {!! csrf_field() !!}
    <div class="left-col col-lg-4">

        <!-- Titulo de la Carta -->
        <div class="form-group">
            {!! Form::label('nombre', 'Titulo:', ['class' => 'control-label']) !!}
            {!! Form::text('nombre', null, ['class' => 'form-control']) !!}
        </div>
        <div class="form-group">
            {!! Form::label('plantilla_id', 'Plantilla base:', ['class' => 'control-label']) !!}
            {!! Form::select('plantilla_id', $plantillas, null, array('class' => 'form-control')) !!}
        </div>
        <div class="form-group">
            <div class="controls-container">
                <a href="#" id="btn-prev-field"><span class="glyphicon glyphicon-chevron-left"></span></a>
                <label for="campo_id" id="campo_id" class="text-center">[Nombre campo]</label>
                <a href="#" id="btn-next-field"><span class="glyphicon glyphicon-chevron-right"></span></a>
            </div>
            <div id="dynamic-fields">

            </div>
        </div>

    </div>
    <div class="right-col col-lg-8">


        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            {!! Form::label('cuerpo', 'Cuerpo:', ['class' => 'control-label']) !!}
            {{--{!! Form::textarea('cuerpo', null, ['class' => 'form-control', 'id' => 'editor', 'disabled']) !!}--}}
            <div id="cuerpo-carta">

            </div>

        </div>
        {!! Form::hidden('thumbnail', null) !!}
        {!! Form::hidden('placeholders', null) !!}
        {!! Form::hidden('cuerpo', null) !!}

        <!-- Guardar Carta -->
        <div class="btn-container">
            <a href="#" class="btn btn-info"><span class="glyphicon glyphicon-eye-open"></span>  Vista previa</a>
            <a href="#" class="btn btn-danger"><span class="glyphicon glyphicon-file"></span>  Descargar PDF</a>
            {!! Form::submit('Guardar Carta', ['class' => 'btn btn-success pull-right', 'id' => 'btn-guardar']) !!}
        </div>
    </div>
    {!! Form::close() !!}
</div>
<script type="text/javascript"  src="{{URL::asset('static/js/cartas.js')}}"></script>

@endsection
