<!-- app/views/plantilla/view.blade.php -->
@extends('layouts.app')

@section('content')

<div class="container">
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')

    <h3>Mostrando: {{ $plantilla->nombre }}</h3>
    <textarea id="editor" readonly>{{ $plantilla->cuerpo }}</textarea>
    <br>
    <a class="btn btn-primary" href="{{ url("plantilla/") }}">&laquo; Volver</a>
</div>
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
