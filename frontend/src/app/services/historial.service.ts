import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistorialPostulacion {
    id_postulacion: number;
    fecha: string;
    postulante: string;
    cargo: string;
    estado: string;
    resultado: string;
    selected?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HistorialPostulacionService {

    private API = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getHistorialPostulaciones(): Observable<HistorialPostulacion[]> {
        return this.http.get<HistorialPostulacion[]>(`${this.API}/historial-postulaciones`);
    }
}