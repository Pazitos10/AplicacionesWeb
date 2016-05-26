@extends('home')
@section('dynamic-content')
    <h3 class="text-center custom-header">{{$carta->nombre}}</h3>
    <hr>
    <input type="hidden" name="name" id="cuerpo" value="{{$carta->cuerpo}}">
    <div id="cuerpo-carta">

    </div>
    <div class="btn-group btn-group-mostrar" style="margin-top:31px">
        <a href="" id="btn-volver" onclick="goBack()" class="btn btn-primary btn-sm" title="ver tabla"><span class="glyphicon glyphicon-chevron-left"></span>Volver a listado</a>
    </div>
    <script type="text/javascript" src="{{URL::asset('static/js/view-cartas.js')}}"></script>
@endsection
