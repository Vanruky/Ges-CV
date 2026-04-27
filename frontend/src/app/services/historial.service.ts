import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface HistorialPostulacion {
    id_postulacion: number;
    fecha: string;
    postulante: string;
    cargo: string;
    estado: string;
}

@Injectable({
    providedIn: 'root'
})
export class HistorialPostulacionService {

    private API = `${environment.apiUrl}/api/admin`;

    constructor(private http: HttpClient) { }
    
    testBackend() {
        return this.http.get(`${environment.apiUrl}/api/test`);
    }

    getHistorialPostulaciones(params?: any) {
        return this.http.get<HistorialPostulacion[]>(
            `${this.API}/historial`,
            { params }
        );
    }

    deletePostulaciones(ids: number[]) {
        return this.http.post<{ message: string }>(
            `${this.API}/delete-postulaciones`,
            { ids }
        );
    }

    exportExcel(params?: any, ids?: number[]) {
        return this.http.get(
            `${this.API}/historial/export/excel`,
            {
                params: {
                    ...params,
                    ids: ids?.join(',')
                },
                responseType: 'blob'
            }
        );
    }

    exportPDF(params?: any, ids?: number[]) {
        return this.http.get(
            `${this.API}/historial/export/pdf`,
            {
                params: {
                    ...params,
                    ids: ids?.join(',')
                },
                responseType: 'blob'
            }
        );
    }
}