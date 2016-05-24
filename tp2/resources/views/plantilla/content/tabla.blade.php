<!-- plantilla/content/tabla.blade.php  -->
<div id="content-tabla">
    <table class="table table-striped table-condensed">
        <thead>
            <th>Nombre</th>
            <th class="hidden-xs">Modificado</th>
            <th class="text-right">Acciones</th>
        </thead>
        <tbody>
            @foreach ($plantillas as $plantilla)
                <tr>
                    <td>{{ $plantilla->nombre }}</td>
                    <td class="hidden-xs">{{ date('d/m/Y - H:i:s', strtotime($plantilla->updated_at)) }}</td>
                    <td class="pull-right">
                        <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $plantilla->id) }}" title="Ver la plantilla"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>
                        <a class="btn btn-default btn-sm " href="{{ URL::to('plantilla/' . $plantilla->id . '/edit') }}" title="Editar la plantilla"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>
                        {{ Form::open(array('url' => 'plantilla/' . $plantilla->id, 'class' => 'form-inline')) }}
                        {{ Form::hidden('_method', 'DELETE') }}
                        {{ Form::button('<i class="glyphicon glyphicon-remove"></i> ', array(
                            'type' => 'submit',
                            'title' => 'Eliminar la plantilla',
                            'class'=> 'btn btn-sm btn-danger',
                            'onclick'=> 'confirmar_eliminacion()' ))
                        }}
                        {{ Form::close() }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
