<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Carta;
use PDF;

class PdfController extends Controller
{
    public function descargar ($id){
        // return PDF::loadFile('https://www.github.com')->stream('github.pdf');
        $carta = Carta::where('id', $id)->first();
        $pdf = PDF::loadHTML($carta->cuerpo);
        return $pdf->stream();
    }

    public function guardar()
    {
        $filename = storage_path('app/example.pdf');
        $pdf = PDF::loadView('https://github.com');
        $pdf->save(storage_path($filename));
    }

    // public function github(){
    //     return \PDF::loadView('ruta.vista', $datos)->download('nombre-archivo.pdf');
    // }
}
