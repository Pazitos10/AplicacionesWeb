<!-- app/views/plantilla/create.blade.php -->
@extends('layouts.app')
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
<script>
    tinymce.init({  selector:'textarea',
                    setup: function (ed) {
                        ed.on('KeyDown', function (e){
                            crear_placeholders(ed);
                        });
                    }
                });
</script>
@section('content')

<div class="col-lg-10 col-lg-offset-1">

    <h3 class="text-center">Crear Nueva Plantilla</h3>
    <!-- will be used to show any messages -->
    @if (Session::has('message'))
        <div class="alert alert-info">{{ Session::get('message') }}</div>
        @endif
    <!-- if there are creation errors, they will show here -->
    @include('common.errors')


    {{ Form::open(array('url' => 'plantilla/', 'id' => 'nueva-plantilla'))  }}
    {!! csrf_field() !!}

            <!-- Nombre de la Plantilla -->
        <div class="form-group">
            {!! Form::label('nombre', 'Nombre:', ['class' => 'control-label']) !!}
            {!! Form::text('nombre', null, ['class' => 'form-control']) !!}
        </div>
        <!-- Cuerpo de la Plantilla -->
        <div class="form-group">
            {!! Form::label('cuerpo', 'Cuerpo:', ['class' => 'control-label']) !!}
            {!! Form::textarea('cuerpo', null, ['class' => 'form-control']) !!}
        </div>
        {!! Form::hidden('thumbnail', null) !!}

        <!-- Guardar Plantilla -->
        {!! Form::submit('Guardar Plantilla', ['class' => 'btn btn-primary', 'id' => 'btn-guardar']) !!}
        </form>

</div>
@endsection
