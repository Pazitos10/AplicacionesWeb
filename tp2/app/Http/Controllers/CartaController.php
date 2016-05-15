<?php

namespace App\Http\Controllers;

use App\Carta;
use App\Plantilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\View;

use App\Http\Requests;

class CartaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['index']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        // get all the nerds
        $cartas = Carta::all();

        // paso todas las plantillas a la vista
        //return \View::make('plantilla.index')
        return \View::make('carta.index')
            ->with('cartas', $cartas);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //Refinar para que solo traiga las plantillas que le pertenecen al usuario.
        $plantillas = Plantilla::lists('nombre', 'id');

        // load the create form (app/views/plantilla/create.blade.php)
        return \View::make('carta.create')
                ->with('plantillas', $plantillas);
    }

    /**
     * Devuelve informacion de plantillas en formato json.
     *
     * @return Response
     */
    public static function get_json_plantilla($id)
    {
        //Refinar para que solo traiga las plantillas que le pertenecen al usuario.
        $plantilla = Plantilla::where('id', $id)->first();
        //$json_response = $plantilla["placeholders"];
        $cuerpo = str_replace("\"", "'", $plantilla["cuerpo"]);
        $json_response = '{ "cuerpo": "'. $cuerpo .'", "placeholders": '. $plantilla["placeholders"] .'}';
        return response()->json($json_response);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        // validate
        // read more on validation at http://laravel.com/docs/validation
        $rules = array(
            'nombre'    => 'required',
            'cuerpo'    => 'required',

        );
        $validator = Validator::make(Input::all(), $rules);

        // process the login
        if ($validator->fails()) {
            return Redirect::to('carta/create')
                ->withErrors($validator)
                ->withInput(Input::except('password'));
        } else {
            // store
            $carta = new Carta();
            $carta->nombre  = Input::get('nombre');
            $carta->cuerpo  = Input::get('cuerpo');
            $carta->plantilla_id = Input::get('plantilla_id');
            $carta->save();

            // redirect
            Session::flash('message', 'Carta Guardada con éxito!');
            return Redirect::to('carta');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        // busco la Carta
        $carta = Carta::find($id);

        // show the edit form and pass the nerd
        return View::make('carta.view')
            ->with('carta', $carta);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        // busco la Carta
        $carta = Carta::find($id);

        // show the edit form and pass the nerd
        return View::make('carta.edit')
            ->with('carta', $carta);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        // validate
        // read more on validation at http://laravel.com/docs/validation
        $rules = array(
            'nombre'       => 'required',
            'cuerpo'      => 'required',
        );
        $validator = Validator::make(Input::all(), $rules);

        // process the login
        if ($validator->fails()) {
            return Redirect::to('carta/' . $id . '/edit')
                ->withErrors($validator)
                ->withInput(Input::except('password'));
        } else {
            // store
            $carta = Carta::find($id);
            $carta->nombre  = Input::get('nombre');
            $carta->cuerpo  = Input::get('cuerpo');
            $carta->plantilla_id = Input::get('plantilla_id');
            $carta->save();

            // redirect
            Session::flash('message', 'Carta actualizada con éxito!');
            return Redirect::to('carta');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        // Busco la Carta
        $plantilla = Carta::find($id);
        $plantilla->delete();

        // redirect
        Session::flash('message', 'Carta eliminada con éxito!');
        return Redirect::to('carta');
    }
}
