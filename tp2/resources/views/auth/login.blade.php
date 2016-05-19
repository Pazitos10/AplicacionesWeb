<!-- resources/views/auth/login.blade.php -->
@extends('home')
@section('dynamic-content')

    <div class="col-lg-6 col-lg-offset-3 col-xs-12">
        <h2 class="text-center custom-header">Iniciar sesión</h2>
        <hr>
        <!-- will be used to show any messages -->
        @if (Session::has('message'))
            <div class="alert alert-info">{{ Session::get('message') }}</div>
            @endif
                    <!-- if there are creation errors, they will show here -->
            @include('common.errors')


        <form method="POST" action="login">
            {!! csrf_field() !!}

            <div class="form-group">
                {!! Form::label('email', 'Email:', ['class' => 'control-label']) !!}
                {!! Form::email('email', old('email'), array('placeholder'=>'Ingresá tu dirección de email', 'class' => 'form-control')) !!}
            </div>

            <div class="form-group">
                {!! Form::label('password', 'Password:', ['class' => 'control-label']) !!}
                {!! Form::password('password', array('placeholder'=>'Ingresá tu Password', 'class'=>'form-control' ) ) !!}
            </div>

            <div class="form-group">
                {!! Form::label('remember', 'Acordate de mi', ['class' => 'control-label']) !!}
                {!! Form::checkbox('remember', null, array('class'=>'form-control' ) ) !!}
            </div>

            <div class="form-group">
                {!! Form::submit('Dejame entrar!', ['class' => 'btn btn-primary lead btn-full-width']) !!}

                <div class="custom-hr-container">
                    <span class="custom-hr"></span> ¿No tenés cuenta? <span class="custom-hr"></span>
                </div>
                <a class="btn btn-default lead btn-full-width" href="register"><span class="glyphicon glyphicon-user"></span>  Quiero registrarme</a>
            </div>

        </form>
    </div>
@endsection
