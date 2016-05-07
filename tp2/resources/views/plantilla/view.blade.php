<!-- app/views/plantilla/view.blade.php -->
@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' , readonly : true });</script>
@section('content')

<div class="container">
    <h1>Ver Plantilla</h1>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')

    <h1>Mostrando {{ $plantilla->nombre }}</h1>

    <textarea readonly>{{ $plantilla->cuerpo }}</textarea>

</div>
@endsection