<!-- app/views/plantilla/edit.blade.php -->
@extends('layouts.app')
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
