<?php

namespace App\Http\Controllers;

use App\Carta;
use App\Plantilla;
use App\User;
use Mail;
use Auth;
use URL;
use DOMDocument;
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
    *   En base al cuerpo publico que se obtuvo del lado del cliente
    *   Se buscan todos los campos que quieren ocultarse y se reemplazan
    *   los valores anonimos por tantas x como letras tenga el dato.
    *   Se mantiene tambien el estilo css para ocultar los datos.
    *   @return nuevo_cuerpo (HTML transformado). 
    */
    private static function get_cuerpo_publico($cuerpo){
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML(utf8_decode($cuerpo));
        $dom->encoding = 'utf-8';
        libxml_clear_errors();
        $wrapper = "<span class='replacement active hidden-text'>";
        $end_wrapper = "</span>";
        for($i = 1; $span = $dom->getElementsByTagName('span')->item(0); $i++) {
            $replacement_lenght = strlen($span->nodeValue);
            $gibberish_replacement = $wrapper.str_repeat("x",$replacement_lenght).$end_wrapper;
            $span->parentNode->replaceChild($dom->createTextNode($gibberish_replacement), $span);
        }
        $nuevo_cuerpo = $dom->saveHTML();
        $nuevo_cuerpo = str_replace("&lt;","<",$nuevo_cuerpo);
        $nuevo_cuerpo = str_replace("&gt;",">",$nuevo_cuerpo);
        return $nuevo_cuerpo;

    }

    private static function guardar_carta($options){
        $styles_url = URL::asset('static/css/styles.css');
        if($options['id'])
            $carta = Carta::find($options['id']);
        else
            $carta = new Carta();
        $carta->autor_id = Auth::user()->id;
        $carta->nombre  = Input::get('nombre');
        $cuerpo_privado = "<!DOCTYPE html><html><head>
                            <meta charset='UTF-8'>
                            <title>". $carta->nombre ."</title></head><body>"
                    . Input::get('cuerpo') .
                    "</body></html>";
        $carta->cuerpo  = $cuerpo_privado;
        if (Input::get('publica') != null){
            $carta->publica = true;
            $carta->cuerpo_publico = "<!DOCTYPE html><html><head>
                                        <meta charset='UTF-8'>
                                        <link rel='stylesheet' href='". $styles_url ."'>
                                        <title>". $carta->nombre ."</title></head><body>"
                                        . self::get_cuerpo_publico(Input::get('cuerpo_publico')) .
                                        "</body></html>";
            $carta->thumbnail_publico = Input::get('thumbnail_publico') ;
        }
        else
            $carta->publica = false;
        $carta->thumbnail = Input::get('thumbnail');
        $carta->placeholders = Input::get('placeholders');
        $carta->save();
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
     * Genera y retorna el PDF de la carta indicada por parametros.
     *
     * @return Response
     */
    public static function get_public_pdf($id_carta)
    {
        $carta = Carta::where('id', $id_carta)->first();
        $pdf = PdfController::descargar_publico($carta);
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
        return \View::make('carta.index', ['cartas' => $cartas]);
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
            try{
                $carta = Carta::where('id', $id_carta)->first();
                $pdf = PdfController::attach_pdf($carta);
                $user =  User::where('id', Auth::user()->id)->first();
                $data = array(
                    'carta' => $carta ,
                    'pdf' => $pdf,
                    'receiver_email' => Input::get('email'),
                    'receiver_name' => Input::get('destinatario'),
                    'display' => $carta->nombre,
                    'sender_email' => $user->email,
                    'sender_name' => $user->name
                );

                Mail::send('mail.message', $data, function($message) use ($data) {
                        $message->from($data['sender_email'], $data['sender_name'])
                            ->to($data['receiver_email'], $data['receiver_name'])
                            ->subject('Bienvenida')
                            ->attachData($data['pdf'], $data['display']);
                    });
            }catch (Swift_TransportException $STe) {
                // logging error
                $string = date("Y-m-d H:i:s")  . ' - ' . $STe->getMessage() . PHP_EOL;
                file_put_contents("errorlog.txt", $string, FILE_APPEND);
                // send error note to user
                $errorMsg = "the mail service has encountered a problem. Please retry later or contact the site admin.";
            }
            catch (Exception $e) {
                // logging error
                $string = date("Y-m-d H:i:s")  . ' - GENERAL ERROR - ' . $e->getMessage() . PHP_EOL;
                file_put_contents("errorlog.txt", $string, FILE_APPEND);
                // redirect to error page
                $app->abort(500, "Oops, something went seriously wrong. Please retry later !");
            }
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
            self::guardar();

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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show_public($id)
    {
        // busco la Carta, se sabe que es publica
        $carta = Carta::find($id);
        $nombre_autor = User::find($carta->autor_id)->name;
        return View::make('carta.content.view-public')
            ->with('carta', $carta)
            ->with('nombre_autor', $nombre_autor );
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
            $this->guardar_carta(['id' => $id]);

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
