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

    <h1>Mostrando {{ $plantilla->nombre }}</h1>

    <textarea readonly>{{ $plantilla->cuerpo }}</textarea>

    <img src="{{ $plantilla->thumbnail }}" alt="" />

    <a class="btn btn-primary" href="{{ url("plantilla/") }}">&laquo; Volver</a>
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
