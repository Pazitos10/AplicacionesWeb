<?php

use App\Plantilla;
use App\Carta;
use App\Http\Controllers\CartaController;
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

    return view('plantilla.index', [
        'plantillas' => $plantillas
    ]);
});


Route::resource('plantilla', 'PlantillaController');
Route::resource('carta', 'CartaController');
Route::get('carta/get_json_plantilla/{id}', function($id){
    return CartaController::get_json_plantilla($id);
});
