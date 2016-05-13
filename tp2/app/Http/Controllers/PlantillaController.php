<?php

namespace App\Http\Controllers;

use App\Plantilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\View;

use App\Http\Requests;

class PlantillaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        // get all the nerds
        $plantillas = Plantilla::all();

        // paso todas las plantillas a la vista
        //return \View::make('plantilla.index')
        return \View::make('home')
            ->with('plantillas', $plantillas);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        // load the create form (app/views/plantilla/create.blade.php)
        return \View::make('plantilla.create');
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
            return Redirect::to('plantilla/create')
                ->withErrors($validator)
                ->withInput(Input::except('password'));
        } else {
            // store
            $plantilla = new Plantilla();
            $plantilla->nombre  = Input::get('nombre');
            $plantilla->cuerpo  = Input::get('cuerpo');
            $plantilla->thumbnail = Input::get('thumbnail');
            $plantilla->save();

            // redirect
            Session::flash('message', 'Plantilla Guardada con éxito!');
            return Redirect::to('plantilla');
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
        // busco la Plantilla
        $plantilla = Plantilla::find($id);

        // show the edit form and pass the nerd
        return View::make('plantilla.view')
            ->with('plantilla', $plantilla);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        // busco la Plantilla
        $plantilla = Plantilla::find($id);

        // show the edit form and pass the nerd
        return View::make('plantilla.edit')
            ->with('plantilla', $plantilla);
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
            return Redirect::to('plantilla/' . $id . '/edit')
                ->withErrors($validator)
                ->withInput(Input::except('password'));
        } else {
            // store
            $plantilla = Plantilla::find($id);
            $plantilla->nombre  = Input::get('nombre');
            $plantilla->cuerpo  = Input::get('cuerpo');
            $plantilla->save();

            // redirect
            Session::flash('message', 'Plantilla actualizada con éxito!');
            return Redirect::to('plantilla');
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
        // Busco la Plantilla
        $plantilla = Plantilla::find($id);
        $plantilla->delete();

        // redirect
        Session::flash('message', 'Plantilla eliminada con éxito!');
        return Redirect::to('plantilla');
    }
}
