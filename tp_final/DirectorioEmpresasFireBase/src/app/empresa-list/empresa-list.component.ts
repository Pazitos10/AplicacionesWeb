import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdList, MdListItem } from '@angular/material/list';

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
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {
  empresas: FirebaseListObservable<Empresa[]>;
  constructor(af: AngularFire) {
    this.empresas = af.database.list('/empresas');
  }

  ngOnInit() {
  }

}
