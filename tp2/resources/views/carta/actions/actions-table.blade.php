    <a class="btn btn-primary btn-sm " href="{{ URL::to('carta/' . $carta->id) }}" title="Ver la carta">
        <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
    </a>
    <a class="btn btn-sm btn-primary" href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" title="Descargar pdf">
        <span class="glyphicon glyphicon-save"></span>
    </a>
    @if(Request::path() != 'carta/publicas')
        <button type="button" class="btn btn-sm btn-primary btn-mail" title="Enviar por email">
            <span class="glyphicon glyphicon-envelope"></span>
        </button>
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
