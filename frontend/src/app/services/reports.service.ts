import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
    id: number;
    nombre: string;
}

export interface Reporte {
    id_reporte?: number;
    tipo_reporte: string;
    descripcion: string;
    fecha_generacion: string;
    url_documento?: string;
    usuario?: { id: number; nombre: string; };
}

@Injectable({
    providedIn: 'root'
})
export class ReportsService {

    private API = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getReportes(): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(`${this.API}/reportes`);
    }

    getReporteById(id: number): Observable<Reporte> {
        return this.http.get<Reporte>(`${this.API}/reportes/${id}`);
    }

    createReporte(reporte: Reporte): Observable<Reporte> {
        return this.http.post<Reporte>(`${this.API}/reportes`, reporte);
    }

    deleteReporte(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API}/reportes/${id}`);
    }
}