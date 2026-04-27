import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reporte {
  id_reporte?: number;
  tipo_reporte: string;
  descripcion: string;
  fecha_generacion: string;
  url_documento?: string;
  usuario?: { id_usuario: number; correo: string };
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private API = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  testBackend() {
    return this.http.get(`${environment.apiUrl}/api/test`);
  }

  getReportes(params?: any): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.API}/reportes`, { params });
  }

  createReporte(formData: FormData): Observable<any> {
    return this.http.post(`${this.API}/reportes`, formData);
  }

  exportExcel(params?: any) {
    return this.http.get(`${this.API}/reportes/export/excel`, {
      params,
      responseType: 'blob'
    });
  }

  exportPDF(params?: any) {
    return this.http.get(`${this.API}/reportes/export/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}