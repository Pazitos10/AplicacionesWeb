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

Route::resource('plantilla', 'PlantillaController');