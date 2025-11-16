import { Observable } from 'rxjs';
import { ICategoria } from '../models/ICategoria'; 
import { Injectable } from '@angular/core';


export abstract class CategoriaRepository {
  abstract getCategorias(): Observable<ICategoria[]>;
}
