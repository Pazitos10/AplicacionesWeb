<!-- app/views/plantilla/edit.blade.php -->
@extends('home')
@section('dynamic-content')

    <h3 class="text-center custom-header">Editar Plantilla</h3>
    <hr>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')

    {!! Form::model($plantilla, [
        'method' => 'PUT',
        'route' => ['plantilla.update', $plantilla->id],
        'id' => 'form-plantilla'
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
        <!-- {!! Form::submit('Guardar Cambios', ['class' => 'btn btn-primary', 'id' => 'btn-guardar']) !!} -->
    </form>

<!-- <script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script> -->
<script src="{{URL::asset('static/js/plantillas.js')}}" charset="utf-8"></script>
<script type="text/javascript" src="{{ URL::asset('static/js/ckeditor/ckeditor.js') }}"></script>
<script>
CKEDITOR.replace( 'editor' );
CKEDITOR.instances.editor.on('change', function(e) {
    crear_placeholders();
});
//aplicamos los cambios al contenido preexistente
CKEDITOR.instances.editor.on('instanceReady', function(e) {
    crear_placeholders();
});

</script>
@endsection
