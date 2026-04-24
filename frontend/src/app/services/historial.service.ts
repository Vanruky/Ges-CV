import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface HistorialPostulacion {
    id_postulacion: number;
    fecha: string;
    postulante: string;
    cargo: string;
    estado: string;
    resultado?: string;
}

@Injectable({
    providedIn: 'root'
})
export class HistorialPostulacionService {

    private API = 'http://localhost:3000/api/admin';

    constructor(private http: HttpClient) { }


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