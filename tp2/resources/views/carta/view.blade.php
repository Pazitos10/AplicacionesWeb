@extends('home')
@section('dynamic-content')
    <!-- @if ($carta) -->
    <h3 class="text-center custom-header">{{$carta->nombre}}</h3>
    <hr>
    <input type="hidden" name="name" id="cuerpo" value="{{$carta->cuerpo}}">
    <div id="cuerpo-carta">

    </div>
    <div class="btn-group btn-group-mostrar">
        <a href="{{ URL::previous() }}" id="btn-volver" class="btn btn-primary btn-sm" title="ver tabla"><span class="glyphicon glyphicon-chevron-left"></span>Volver a listado</a>
    </div>
    <!-- @endif -->
    <script type="text/javascript">
        $(document).ready(function () {
            var contenido = $('#cuerpo').val();
            $('#cuerpo-carta').empty();
            $('#cuerpo-carta').append(contenido);
        })

    </script>
@endsection
