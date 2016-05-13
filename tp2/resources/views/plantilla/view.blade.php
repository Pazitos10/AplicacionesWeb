<!-- app/views/plantilla/view.blade.php -->
@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' , readonly : true });</script>
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
@endsection
