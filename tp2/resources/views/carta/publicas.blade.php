<!-- app/views/carta/publicas.blade.php -->
@extends('home')
@section('dynamic-content')
    @if (count($cartas) > 0)
    <h3 class="text-center custom-header">Cartas Públicas</h3>
    <hr>
    <div class="btn-group btn-group-mostrar">
        <button id="btn-tabla" class="btn btn-default btn-sm" title="ver tabla"><span class="glyphicon glyphicon-th-list"></span></button>
        <button id="btn-listado" class="btn btn-default btn-sm" title="ver listado"><span class="glyphicon glyphicon-th"></span></button>
    </div>
    <div id="content-tabla">
        <table class="table table-striped table-condensed">
            <thead>
                <th>Titulo</th>
                <th class="hidden-xs">Modificado</th>
                <th class="text-right">Acciones</th>
            </thead>
            <tbody>
                @foreach ($cartas as $carta)
                    <tr>
                        <td>
                            {{ $carta->nombre }}
                        </td>
                        <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                        <td class="pull-right">
                            <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                            <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save"></span></a>
                            <!-- <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/edit') }}" title="Editar la carta"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a> -->
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div id="content-listado">
        <div class="row list-wrapper">
            @foreach ($cartas as $carta)
                <div class="col-md-3 item">
                    <a href="{{ URL::to('carta/'.$carta->id) }}">
                        @if (isset($carta->thumbnail))
                            <div class="crop">
                                <img class="thumb-cartas" src="{{ $carta->thumbnail }}" alt="">
                            </div>
                        @else
                            <img class="img-responsive thumb" src="http://placehold.it/700x400" alt="" />
                        @endif
                    </a>
                    <div class="btn-group btn-item-options">
                        <a href="{{ URL::to('carta/' . $carta->id) }}" title="Ver" class=""><span class="glyphicon glyphicon-eye-open btn-on-item"></span></a>
                        <a href="{{ URL::to('carta/' . $carta->id  .'/get_pdf') }}" title="Descargar" class=""><span class="glyphicon glyphicon-save btn-on-item"></span></a>
                    </div>
                    <h4 class="nombre-carta">
                        {{ $carta->nombre }}
                    </h4>
                </div>
            @endforeach
        </div>
        <!-- /.row -->
    </div>
    @else
        <h3 class="text-muted text-center">
            <strong>
                <p>No hay cartas públicas para mostrar.</p>
                <p>Crea una por medio de Cartas -> Crear o edita una de tus cartas, y activa el campo pública.</p>
            </strong>
        </h3>

    @endif

@endsection
