@extends('home')
@section('dynamic-content')
    <h3 class="text-center custom-header">{{$carta->nombre}}</h3>
    <h6 class="text-center text-muted"><strong>por: {{$nombre_autor}}</strong></h6>
    <hr>
    <input type="hidden" name="name" id="cuerpo" value="{{$carta->cuerpo_publico}}">
    <div id="cuerpo-carta">

    </div>
    <div class="" style="margin-top:21px">
        <a href="" onclick="goBack()" id="btn-volver" class="btn btn-primary btn-sm pull-left" title="ver tabla"><span class="glyphicon glyphicon-chevron-left"></span>Volver a listado</a>
        <a class="btn btn-sm btn-primary pull-right" href="{{ URL::to('carta/' . $carta->id . '/get_public_pdf') }}" id="btn-pdf" title="Descargar pdf"> Descargar PDF <span class="glyphicon glyphicon-save"></span></a>
    </div>
    <script type="text/javascript" src="{{URL::asset('static/js/view-cartas.js')}}"></script>
@endsection
