import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReturnMedicineDTO, CreateMedicineDTO, MedicineParams} from '../_models/medicine.types';
import { PagedList } from '../_models/service.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private http = inject(HttpClient);
  private baseUrlMedicine = `${environment.apiUrl}medicine`;

  getAllMedicines(): Observable<ReturnMedicineDTO[]> {
    return this.http.get<ReturnMedicineDTO[]>(`${this.baseUrlMedicine}/all`);
  }

  getMedicinesWithFilter(params: MedicineParams): Observable<PagedList<ReturnMedicineDTO>> {
    let httpParams = new HttpParams();

    if (params.name) httpParams = httpParams.append('name', params.name);
    if (params.category && params.category.length > 0) {
      params.category.forEach(cat => {
        httpParams = httpParams.append('category', cat);
      });
    }
    

    if (params.requiresSpecialApproval !== null && params.requiresSpecialApproval !== undefined) {
        httpParams = httpParams.append('requiresSpecialApproval', params.requiresSpecialApproval.toString());
    }

    if (params.minStock !== null && params.minStock !== undefined && params.minStock !== 0) {
        httpParams = httpParams.append('minStock', params.minStock.toString());
    }
    if (params.maxStock !== null && params.maxStock !== undefined && params.maxStock !== 0) {
        httpParams = httpParams.append('maxStock', params.maxStock.toString());
    }

    if (params.sortBy) {
        httpParams = httpParams.append('sortBy', params.sortBy);
    }
    if (params.isDescending !== null && params.isDescending !== undefined) {
        httpParams = httpParams.append('isDescending', params.isDescending.toString());
    }

    httpParams = httpParams.append('pageNumber', (params.pageNumber ?? 1).toString());
    httpParams = httpParams.append('pageSize', (params.pageSize ?? 10).toString());

    return this.http.get<PagedList<ReturnMedicineDTO>>(this.baseUrlMedicine, { params: httpParams });
}

  
 
  getMedicineById(id: number): Observable<ReturnMedicineDTO> {
    return this.http.get<ReturnMedicineDTO>(`${this.baseUrlMedicine}/${id}`).pipe();
  }
 
  createMedicine(medicine: CreateMedicineDTO): Observable<ReturnMedicineDTO> {
    return this.http.post<ReturnMedicineDTO>(this.baseUrlMedicine, medicine).pipe();
  }
 
  updateMedicine(id: number, medicine: CreateMedicineDTO): Observable<ReturnMedicineDTO> {
    return this.http.put<ReturnMedicineDTO>(`${this.baseUrlMedicine}/${id}`, medicine).pipe();
  }
 
  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlMedicine}/${id}`).pipe();
  }
}