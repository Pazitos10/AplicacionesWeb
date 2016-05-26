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

Route::get('carta/publicas', 'CartaController@get_publicas');
Route::get('carta/{id}/public', 'CartaController@show_public');

Route::get('/', 'PlantillaController@index');
Route::resource('plantilla', 'PlantillaController');
Route::resource('carta', 'CartaController');



/* Rutas AJAX */
/* Se utiliza durante la creacion de cartas */
Route::get('carta/get_json_plantilla/{id_plantilla}/{id_carta?}', function($id_plantilla, $id_carta=null){
    return CartaController::get_json_plantilla($id_plantilla, $id_carta);
});


/*  Se utiliza durante la edicion de cartas
*   ¿Por qué parece duplicada?
*   Rta: No es posible tener una ruta con uno o mas argumentos opcionales
*   seguidos por argumentos requeridos.
*/
Route::get('carta/{id_carta}/get_json_plantilla/{id_plantilla}',
        function($id_carta, $id_plantilla){
            return CartaController::get_json_plantilla($id_plantilla);
});

Route::get('carta/{id_carta}/get_pdf/',
        function($id_carta){
            return CartaController::get_pdf($id_carta);
});

Route::get('carta/{id_carta}/get_public_pdf/',
        function($id_carta){
            return CartaController::get_public_pdf($id_carta);
});

Route::post('carta/{id_carta}/send_mail', 'CartaController@send_mail');
