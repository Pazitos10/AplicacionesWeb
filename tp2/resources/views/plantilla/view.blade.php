<!-- app/views/plantilla/view.blade.php -->
@extends('home')

@section('dynamic-content')

    <h3 class="text-center custom-header">{{$plantilla->nombre}}</h3>
    <hr>
    <textarea id="editor" readonly>{{ $plantilla->cuerpo }}</textarea>

    <div class="btn-group btn-group-mostrar">
        <a class="btn btn-primary" href="{{ url("plantilla/") }}"><span class="glyphicon glyphicon-chevron-left"></span> Volver</a>
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
