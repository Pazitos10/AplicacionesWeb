<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Carta;
use PDF;

class PdfController extends Controller
{
    public static function descargar ($carta){
        $pdf = PDF::loadHTML($carta->cuerpo);
        $filename = strtolower(str_replace(' ','_',$carta->nombre)).'.pdf';
        return $pdf->download($filename);
    }

    public static function guardar($nombre, $cuerpo)
    {
        $filename = storage_path('app/public/'. $nombre . '.pdf');
        $pdf = PDF::generateFromHtml($cuerpo, $filename,[],$overwrite = true);
        // $pdf->save($filename, true);
    }

    public static function attach_pdf($carta)
    {
        $pdf = PDF::loadHTML($carta->cuerpo);
        return $pdf->output();
    }

}
