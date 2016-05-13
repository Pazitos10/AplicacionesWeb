<!-- resources/views/auth/register.blade.php -->
@extends('layouts.app')
@section('content')

    <div class="container">
        <h1>Registro de Usuarios</h1>
        <!-- will be used to show any messages -->
        @if (Session::has('message'))
            <div class="alert alert-info">{{ Session::get('message') }}</div>
            @endif
                    <!-- if there are creation errors, they will show here -->
            @include('common.errors')

        <form method="POST" action="register">
            {!! csrf_field() !!}
            <div class="form-group">
                {!! Form::label('nombre', 'Nombre:', ['class' => 'control-label']) !!}
                {!! Form::text('name', old('name'), array('placeholder'=>'Ingresá tu nombre', 'class' => 'form-control')) !!}
            </div>

            <div class="form-group">
                {!! Form::label('email', 'Email:', ['class' => 'control-label']) !!}
                {!! Form::email('email', old('email'), array('placeholder'=>'Ingresá tu dirección de email', 'class' => 'form-control')) !!}
            </div>

            <div class="form-group">
                {!! Form::label('password', 'Password:', ['class' => 'control-label']) !!}
                {!! Form::password('password', array('placeholder'=>'Ingresá tu Password', 'class'=>'form-control' ) ) !!}
            </div>

            <div class="form-group">
                {!! Form::label('password_confirmation', 'Confirmar Password:', ['class' => 'control-label']) !!}
                {!! Form::password('password_confirmation', array('placeholder'=>'Confirmá Password', 'class'=>'form-control' ) ) !!}
            </div>

            {!! Form::submit('Registrarme!', ['class' => 'btn btn-primary']) !!}
        </form>
    </div>
@endsection