<!-- app/views/plantilla/create.blade.php -->
@extends('home')

@section('dynamic-content')

<div class="col-lg-10 col-lg-offset-1">

    <h3 class="text-center custom-header">Crear Plantilla</h3>
    <hr>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')


    {{ Form::open(array('url' => 'plantilla/', 'id' => 'form-plantilla'))  }}
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
        {!! Form::hidden('placeholders', null) !!}

        <!-- Guardar Plantilla -->
        {{ Form::button('<span class="glyphicon glyphicon-floppy-disk"></span> <span class="hidden-xs"><b>Guardar</b></span> ', array(
            'type' => 'submit',
            'class'=> 'btn btn-md pull-right btn-success',
            'id' => 'btn-guardar')
            )
        }}
        <!-- {!! Form::submit('Guardar', ['class' => 'btn btn-success pull-right', 'id' => 'btn-guardar']) !!} -->
        </form>

</div>
<!--script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script-->
<script type="text/javascript" src="{{ URL::asset('static/js/ckeditor/ckeditor.js') }}"></script>
<script>

CKEDITOR.replace( 'editor' );
CKEDITOR.instances.editor.on('change', function(e) {
    // obtiene lo ingresado en formato html
    //var self = this;
    // setTimeout(function() {
    //     console.log(self.getData());
    // }, 10);
    crear_placeholders();
});


</script>
@endsection
