<!-- app/views/carta/create.blade.php -->
@extends('home')

@section('dynamic-content')

    <h3 class="text-center custom-header">Crear Carta</h3>
    <hr>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')


    {{ Form::open(array('url' => 'carta/', 'id' => 'form-carta'))  }}
    {!! csrf_field() !!}
    <div class="left-col col-lg-4 col-xs-12">

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
            <label for="switch-publica">Pública:</label>
            <div class="material-switch pull-right" id="switch-publica">
                <input id="custom-switch" name="publica" type="checkbox"/>
                <label for="custom-switch" class="label-success label-success-switch"></label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
                <a href="#" id="btn-prev-field" class="btn btn-xs btn-primary"><span class="glyphicon glyphicon-chevron-left"></span></a>
                <label for="campo_id" id="campo_id" class="text-center"></label>
                <a href="#" id="btn-next-field" class="btn btn-xs btn-primary"><span class="glyphicon glyphicon-chevron-right"></span></a>
            </div>
            <div id="dynamic-fields">

            </div>
        </div>

    </div>
    <div class="right-col col-lg-8 col-xs-12">


        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            {!! Form::label('cuerpo-carta', 'Cuerpo:', ['class' => 'control-label']) !!}
            <div id="cuerpo-carta">

            </div>

        </div>
        {!! Form::hidden('placeholders', null, ['id' => 'placeholders']) !!}
        {!! Form::hidden('cuerpo', null, ['id' => 'cuerpo']) !!}

        <!-- Guardar Carta -->
        <div class="btn-container">
            <!-- <div class="btn-group"> -->
                <a href="#" class="btn btn-md btn-info" id="btn-vista-previa"><span class="glyphicon glyphicon-eye-open"></span> <span class="hidden-xs"><b> Vista previa </b></span></a>
                <a href="#" class="btn btn-md btn-danger" id="btn-pdf"><span class="glyphicon glyphicon-save"></span><span class="hidden-xs"><b>  Descargar PDF </b></span></a>
                <a href="#" class="btn btn-md btn-warning" id="btn-mail"><span class="glyphicon glyphicon-envelope"></span><span class="hidden-xs"><b> Enviar por E-mail </b></span></a>
                <!-- {!! Form::submit('Guardar Carta', ['class' => 'btn btn-success pull-right', 'id' => 'btn-guardar']) !!} -->
                {{ Form::button('<span class="glyphicon glyphicon-floppy-disk"></span> <span class="hidden-xs"><b>Guardar</b></span> ', array(
                    'type' => 'submit',
                    'class'=> 'btn btn-md btn-success',
                    'id' => 'btn-guardar-carta')
                    )
                }}
            <!-- </div> -->
        </div>
    </div>
    {!! Form::close() !!}



<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.epoxy/1.3.1/backbone.epoxy.js"></script>
<script type="text/javascript"  src="{{URL::asset('static/js/cartas.js')}}"></script>

@endsection
