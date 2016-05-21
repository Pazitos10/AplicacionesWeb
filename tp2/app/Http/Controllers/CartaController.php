<?php

namespace App\Http\Controllers;

use App\Carta;
use App\Plantilla;
use Mail;
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
    public static function get_json_plantilla($id_plantilla)
    {
        //Refinar para que solo traiga las plantillas que le pertenecen al usuario.
        $plantilla = Plantilla::where('id', $id_plantilla)->first();
        $placeholders = $plantilla["placeholders"];
        $cuerpo = str_replace("\"", "'", $plantilla["cuerpo"]);
        $json_response = '{ "cuerpo": "'. $cuerpo .'", "placeholders": '. $placeholders .'}';
        return response()->json($json_response);
    }


    /**
     * Genera y retorna el PDF de la carta indicada por parametros.
     *
     * @return Response
     */
    public static function get_pdf($id_carta)
    {
        $carta = Carta::where('id', $id_carta)->first();
        $pdf = PdfController::descargar($carta);
        return $pdf;
    }

    /**
     * Obtiene las cartas publicas.
     *
     * @return Response
     */
    public static function get_publicas()
    {
        $cartas = Carta::where('publica', true)->get();
        return \View::make('carta.publicas', ['cartas' => $cartas]);
    }



    /**
     * Genera y envia por mail, el PDF de la carta indicada por parametros.
     *
     * @return Response
     */
    public static function send_mail($id_carta)
    {
        $rules = array(
            'email'    => 'required',
            'destinatario'    => 'required',

        );
        $validator = Validator::make(Input::all(), $rules);

        // process the login
        if ($validator->fails()) {
            $cartas = Cartas::all();
            return Redirect::to('carta.index')
                ->with('cartas', $cartas)
                ->withErrors($validator);
        } else {
            $carta = Carta::where('id', $id_carta)->first();
            $pdf = PdfController::attach_pdf($carta);

            $data = array(
                'carta' => $carta ,
                'pdf' => $pdf,
                'mail_to' => Input::get('email'),
                'nombre' => Input::get('destinatario'),
                'display' => $carta->nombre
            );

            Mail::send('mail.message', $data, function($message) use ($data) {
                    $message->from('pazosbruno@gmail.com', 'Bruno Pazos')
                        ->to($data['mail_to'], $data['nombre'])
                        ->subject('Bienvenida')
                        ->attachData($data['pdf'], $data['display']);
                });
        }
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
            $cuerpo = "<!DOCTYPE html><html><head><meta charset='UTF-8'>
                        <title>". $carta->nombre ."</title></head><body>"
                        . Input::get('cuerpo') .
                        "</body></html>";
            $carta->cuerpo  = $cuerpo;
            if (Input::get('publica') != null)
                $carta->publica = true;
            else
                $carta->publica = false;
            $carta->thumbnail = Input::get('thumbnail');
            $carta->plantilla_id = Input::get('plantilla_id');
            $carta->placeholders = Input::get('placeholders');
            $carta->save();

            // PdfController::guardar(str_to_lower(str_replace(' ', '_', $carta->nombre)), $carta->cuerpo);
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
        $plantillas = Plantilla::lists('nombre', 'id');

        // show the edit form and pass the nerd
        return View::make('carta.edit')
            ->with('carta', $carta)
            ->with('plantillas', $plantillas);
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
            $cuerpo = "<!DOCTYPE html><html><head><meta charset='UTF-8'>
                        <title>". $carta->nombre ."</title></head><body>"
                        . Input::get('cuerpo') .
                        "</body></html>";
            $carta->cuerpo  = $cuerpo;
            if (Input::get('publica') != null)
                $carta->publica = true;
            else
                $carta->publica = false;
            $carta->thumbnail = Input::get('thumbnail');
            $carta->placeholders = Input::get('placeholders');
            $carta->save();

            // PdfController::guardar(strtolower(str_replace(' ', '_', $carta->nombre)), $carta->cuerpo);
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
        $carta = Carta::find($id);
        $carta->delete();

        // redirect
        Session::flash('message', 'Carta eliminada con éxito!');
        return Redirect::to('carta');
    }
}
