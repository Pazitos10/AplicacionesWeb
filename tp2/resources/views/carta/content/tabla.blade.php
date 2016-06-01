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
                        @if(Request::path() == 'carta/publicas')
                            <td>
                                {{ $carta->nombre }}
                            </td>
                            <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($carta->updated_at)) }}</td>
                            <td class="pull-right">
                                <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/public' ) }}" title="Ver la carta"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                                <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_public_pdf') }}" id="btn-pdf" title="Descargar pdf"><span class="glyphicon glyphicon-save"></span></a>
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
                                <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta">
                                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                                </a>
                                <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf">
                                    <span class="glyphicon glyphicon-save"></span>
                                </a>
                                <!-- <button type="button" class="btn btn-sm btn-primary btn-mail" id="btn-send-mail" title="Enviar por email" data-id="{{$carta->id}}"> -->
                                <a class="btn btn-sm btn-primary btn-mail btn-send-mail" href="{{ URL::to('carta/' . $carta->id . '/send_mail') }}" title="Enviar por email">
                                    <span class="glyphicon glyphicon-envelope"></span>
                                </a>
                                @if(Request::path() != 'carta/publicas')
                                    <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id . '/edit') }}" title="Editar la carta">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </a>
                                    {{ Form::open(array('url' => 'carta/' . $carta->id, 'class' => 'form-inline')) }}
                                    {{ Form::hidden('_method', 'DELETE') }}
                                    {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                                        'type' => 'submit',
                                        'title' => 'Eliminar la carta',
                                        'class'=> 'btn btn-sm btn-danger',
                                        'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
                                    }}
                                    {{ Form::close() }}
                                @endif
                            </td>
                            <td class="pull-right visible-xs">
                                <button class="btn btn-xs btn-info btn-menu-responsive" data-id="{{$carta->id}}">
                                    <span class="glyphicon glyphicon-menu-hamburger"></span>
                                </button>
                            </td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
    </table>
</div>
