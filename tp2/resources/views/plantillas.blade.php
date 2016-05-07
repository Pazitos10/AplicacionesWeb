@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>tinymce.init({ selector:'textarea' });</script>
@section('content')

<!-- Bootstrap Boilerplate... -->

<div class="panel-body">
    <!-- Display Validation Errors -->
        @include('common.errors')
        
    <!-- Formulario para Nueva Plantilla -->
    <form action="{{ url('plantilla') }}" method="POST" class="form-horizontal">
        {!! csrf_field() !!}

        <!-- Nombre de la Plantilla -->
        <div class="form-group">
            <label for="nombre" class="col-sm-3 control-label">Nombre</label>
            <div class="col-sm-6">
                <input type="text" name="nombre" id="plantilla-nombre" class="form-control">
            </div>
        </div>
        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            <label for="cuerpo" class="col-sm-3 control-label">Cuerpo</label>
            <div class="col-sm-6">
                <textarea name="cuerpo" id="plantilla-cuerpo" class="form-control"></textarea>
            </div>
        </div>

        <!-- Guardar Plantilla -->
        <div class="form-group">
            <div class="col-sm-offset-3 col-sm-6">
                <button type="submit" class="btn btn-default">
                    <i class="fa fa-plus"></i> Guardar Plantilla
                </button>
            </div>
        </div>
    </form>

    <!-- Plantillas Actualess -->
    @if (count($plantillas) > 0)
        <div class="panel panel-default">
            <div class="panel-heading">
                Plantillas Actuales
            </div>

            <div class="panel-body">
                <table class="table table-striped task-table">

                    <!-- Table Headings -->
                    <thead>
                        <th>Plantilla</th>
                        <th>&nbsp;</th>
                    </thead>

                    <!-- Table Body -->
                    <tbody>
                        @foreach ($plantillas as $plantilla)
                            <tr>
                                <!-- Nombre -->
                                <td class="table-text">
                                    <div>{{ $plantilla->nombre }}</div>
                                </td>
                                <!-- Edit Button -->
                                <td>
                                    <form action="{{ url('plantilla/edit/'.$plantilla->id) }}" method="POST">
                                        {!! csrf_field() !!}
                                        {!! method_field('GET') !!}

                                        <button type="submit" class="btn btn-danger">
                                            <i class="fa fa-trash"></i> Editar
                                        </button>
                                    </form>
                                </td>
                                <!-- Delete Button -->
                                <td>
                                    <form action="{{ url('plantilla/'.$plantilla->id) }}" method="POST">
                                        {!! csrf_field() !!}
                                        {!! method_field('DELETE') !!}

                                        <button type="submit" class="btn btn-danger">
                                            <i class="fa fa-trash"></i> Eliminar
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @endif
</div>
@endsection