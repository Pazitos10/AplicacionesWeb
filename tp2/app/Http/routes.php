<?php

use App\Plantilla;
use Illuminate\Http\Request;

/**
 * Show Plantilla Dashboard
 */
Route::get('/', function () {
    $plantillas = Plantilla::orderBy('created_at', 'asc')->get();

    return view('plantillas', [
        'plantillas' => $plantillas
    ]);
});

/**
 * Agrega una nueva Plantilla
 */
Route::post('/plantillas', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'cuerpo' => 'required',
    ]);

    if ($validator->fails()) {
        return redirect('/')
            ->withInput()
            ->withErrors($validator);
    }

    $plantilla = new Plantilla;
    $plantilla->cuerpo = $request->cuerpo;
    $plantilla->save();

    return redirect('/');
});

/**
 * Elimina Plantilla
 */
Route::delete('/plantillas/{plantilla}', function (Plantilla $plantilla) {
    $plantilla->delete();

    return redirect('/');
});