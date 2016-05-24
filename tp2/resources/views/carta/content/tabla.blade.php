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
                        @if(Request::path() == 'carta/publica')
                            <td>
                                {{ $carta->nombre }}
                            </td>
                            <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                            <td class="pull-right">
                                <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                                <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save"></span></a>
                            </td>
                        @else
                            <td>
                                {{ $carta->nombre }}
                                @if(!($carta->publica))
                                    <span class="glyphicon glyphicon-lock" title="carta privada"></span>
                                @endif
                            </td>
                            <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                            <td class="pull-right hidden-xs">
                                @include('carta.actions.actions-table', ['cartas' => $cartas])
                            </td>
                            <td class="pull-right visible-xs">
                                <button class="btn btn-xs btn-info btn-menu-responsive"><span class="glyphicon glyphicon-menu-hamburger"></span></button>
                            </td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
    </table>
</div>
@include('carta.modals.modal-mail', ['carta' => $carta])
@include('carta.modals.modal-menu-responsive', ['carta' => $carta])
