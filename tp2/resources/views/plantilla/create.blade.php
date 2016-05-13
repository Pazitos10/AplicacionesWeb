<!-- app/views/plantilla/create.blade.php -->
@extends('layouts.app')

@section('content')

<div class="col-lg-10 col-lg-offset-1">

    <h3 class="text-center">Crear Nueva Plantilla</h3>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')


    {{ Form::open(array('url' => 'plantilla/', 'id' => 'nueva-plantilla'))  }}
    {!! csrf_field() !!}

            <!-- Nombre de la Plantilla -->
        <div class="form-group">
            {!! Form::label('nombre', 'Nombre:', ['class' => 'control-label']) !!}
            {!! Form::text('nombre', null, ['class' => 'form-control']) !!}
        </div>
        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            {!! Form::label('cuerpo', 'Cuerpo:', ['class' => 'control-label']) !!}
            {!! Form::textarea('cuerpo', null, ['class' => 'form-control', 'id' => 'editor']) !!}
        </div>
        {!! Form::hidden('thumbnail', null) !!}

        <!-- Guardar Plantilla -->
        {!! Form::submit('Guardar Plantilla', ['class' => 'btn btn-primary', 'id' => 'btn-guardar']) !!}
        </form>

</div>
<script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script>
<script>

CKEDITOR.replace( 'editor' );
CKEDITOR.instances.editor.on('key', function(e) {
    // obtiene lo ingresado en formato html
    //var self = this;
    // setTimeout(function() {
    //     console.log(self.getData());
    // }, 10);
    crear_placeholders();
});

</script>
@endsection
