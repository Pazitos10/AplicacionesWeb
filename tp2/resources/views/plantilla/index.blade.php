@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' });</script>
@section('content')

<div class="container">

    <nav class="navbar navbar-inverse">
        <div class="navbar-header">
            <a class="navbar-brand" href="{{ URL::to('plantilla') }}">Nerd Alert</a>
        </div>
        <ul class="nav navbar-nav">
            <li><a href="{{ URL::to('plantilla') }}">Ver todas las Plantillas</a></li>
            <li><a href="{{ URL::to('plantilla/create') }}">Crear nueva Plantilla</a>
        </ul>
    </nav>

    <h1>Todas las Plantillas</h1>

    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
    @endif

    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>Actions</td>
        </tr>
        </thead>
        <tbody>
        @foreach($plantillas as $key => $value)
            <tr>
                <td>{{ $value->id }}</td>
                <td>{{ $value->nombre }}</td>

                <!-- we will also add show, edit, and delete buttons -->
                <td>

                    <!-- delete the nerd (uses the destroy method DESTROY /plantilla/{id} -->
                    <!-- we will add this later since its a little more complicated than the other two buttons -->

                    <!-- show the nerd (uses the show method found at GET /plantilla/{id} -->
                    <a class="btn btn-small btn-success" href="{{ URL::to('plantilla/' . $value->id) }}">Ver esta Plantilla</a>

                    <!-- edit this nerd (uses the edit method found at GET /plantilla/{id}/edit -->
                    <a class="btn btn-small btn-info" href="{{ URL::to('plantilla/' . $value->id . '/edit') }}">Editar esta Plantilla</a>

                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

</div>
@endsection