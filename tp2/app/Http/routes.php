<?php

use App\Plantilla;
use Illuminate\Http\Request;

// Authentication routes...
Route::get('login', 'Auth\AuthController@getLogin');
Route::post('login', 'Auth\AuthController@postLogin');
Route::get('logout', 'Auth\AuthController@logout');


// Registration routes...
Route::get('register', 'Auth\AuthController@getRegister');
Route::post('register', 'Auth\AuthController@postRegister');

/**
 * Show Plantilla Dashboard
 */
Route::get('/', function () {
    $plantillas = Plantilla::orderBy('created_at', 'asc')->get();

    return view('home', [
        'plantillas' => $plantillas
    ]);
});

Route::resource('plantilla', 'PlantillaController');