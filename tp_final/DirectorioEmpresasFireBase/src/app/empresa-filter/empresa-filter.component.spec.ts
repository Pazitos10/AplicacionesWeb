/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmpresaFilterComponent } from './empresa-filter.component';

describe('EmpresaFilterComponent', () => {
  let component: EmpresaFilterComponent;
  let fixture: ComponentFixture<EmpresaFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
