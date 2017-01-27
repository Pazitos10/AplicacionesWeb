import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdList, MdListItem } from '@angular/material/list';
import {forEach} from "@angular/router/src/utils/collection";

const CATEGORIAS = [
  {id: "all", icono: "assignment", titulo: "Todos"},
  {id: "store", icono: "store", titulo: "Negocios"},
  {id: "car", icono: "directions_car", titulo: "Transporte"},
  {id: "hotel", icono: "hotel", titulo: "Hospedaje"},
  {id: "food", icono: "local_dining", titulo: "Comida"},
  {id: "gas_station", icono: "local_gas_station", titulo: "Combustible"},
  {id: "health", icono: "local_hospital", titulo: "Salud"}
];

class Empresa{
  cuit: number;
  direccion: string;
  localidad: string;
  provincia: string;
  latitud: number;
  longitud: number;
  razonSocial: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  categorias = CATEGORIAS;
  empresas: FirebaseListObservable<Empresa[]>;
  title: string = 'Directorio de Empresas';
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor(af: AngularFire) {
    this.empresas = af.database.list('/empresas');

    this.empresas.forEach(element => {
      console.log(element);
    });
  }
}
