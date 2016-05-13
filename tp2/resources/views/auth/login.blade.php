<!-- resources/views/auth/login.blade.php -->
@extends('layouts.app')
@section('content')

    <div class="container">
        <h1>Iniciar sesión</h1>
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

            {!! Form::submit('Dejame entrar!', ['class' => 'btn btn-primary']) !!}

            <a class="btn btn-primary" href="register">Quiero registrarme</a>

        </form>
    </div>
@endsection