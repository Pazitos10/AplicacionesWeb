import { Component, OnInit } from '@angular/core';

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
  selector: 'app-empresa-filter',
  templateUrl: './empresa-filter.component.html',
  styleUrls: ['./empresa-filter.component.css']
})
export class EmpresaFilterComponent implements OnInit {
  categorias = CATEGORIAS;
  constructor() { }

  ngOnInit() {
  }

}
