    <a href="{{URL::to('./carta/'. $carta->id )}}" class="list-group-item"><span class="glyphicon glyphicon-eye-open"></span> Vista Previa</a>
    <a href="{{ URL::to('carta/' . $carta->id . '/get_pdf') }}" id="btn-pdf" class="list-group-item"><span class="glyphicon glyphicon-save"></span> Descargar pdf</a>
    @if(Request::path() != 'carta/publicas' )
        <button type="button" class="list-group-item btn-mail"><span class="glyphicon glyphicon-envelope"></span> Enviar por e-mail</button>
        <a href="{{ URL::to('carta/' . $carta->id . '/edit') }}" class="list-group-item"><span class="glyphicon glyphicon-pencil"></span> Editar</a>
        {{ Form::open(array('url' => 'carta/' . $carta->id)) }}
        {{ Form::hidden('_method', 'DELETE') }}
        {{ Form::button('<i class="glyphicon glyphicon-remove"></i> Eliminar', array(
            'type' => 'submit',
            'title' => 'Eliminar la carta',
            'class'=> 'list-group-item list-group-item-danger',
            'onclick'=>'return confirm("Estás seguro de eliminar la Carta?")'))
        }}
        {{ Form::close() }}
    @endif
