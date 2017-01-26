import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

const CATEGORIAS = [
  {id: "all", icono: "assignment", titulo: "Todos"},
  {id: "store", icono: "store", titulo: "Negocios"},
  {id: "car", icono: "directions_car", titulo: "Transporte"},
  {id: "hotel", icono: "hotel", titulo: "Hospedaje"},
  {id: "food", icono: "local_dining", titulo: "Comida"},
  {id: "gas_station", icono: "local_gas_station", titulo: "Combustible"},
  {id: "health", icono: "local_hospital", titulo: "Salud"}
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  categorias = CATEGORIAS;
  items: FirebaseListObservable<any[]>;
  title = 'Directorio de Empresas';
  constructor(af: AngularFire) {
    this.items = af.database.list('/items');
  }
}
