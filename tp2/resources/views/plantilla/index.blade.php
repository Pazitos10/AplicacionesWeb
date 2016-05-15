<!-- app/views/plantilla/index.blade.php -->
@extends('layouts.app')

@section('content')

<div class="container">
    <h1>Todas las Plantillas</h1>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
    @endif
    <div class="panel panel-default">
        <div class="panel-heading">
            Plantillas Actuales
        </div>
        <table class="table table-striped table-condensed">
            <thead>
            <tr>
                <td>ID</td>
                <td>Nombre</td>
                <td>Acciones</td>
            </tr>
            </thead>
            <tbody>
            @foreach($plantillas as $key => $value)
                <tr>
                    <td>{{ $value->id }}</td>
                    <td>{{ $value->nombre }}</td>

                    <!-- we will also add show, edit, and delete buttons -->
                    <td>
                        <a class="btn btn-small btn-default" href="{{ URL::to('plantilla/' . $value->id) }}" title="Ver la plantilla"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                        <a class="btn btn-small btn-default" href="{{ URL::to('plantilla/' . $value->id . '/edit') }}" title="Editar la plantilla"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                        {{ Form::open(array('url' => 'plantilla/' . $value->id, 'class' => 'pull-right')) }}
                        {{ Form::hidden('_method', 'DELETE') }}
                        {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                        'type' => 'submit',
                        'title' => 'Eliminar la plantilla',
                        'class'=> 'btn btn-small btn-danger',
                        'onclick'=>'return confirm("Estás seguro de eliminar la Plantilla?")'))
                        }}
                        {{ Form::close() }}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection
