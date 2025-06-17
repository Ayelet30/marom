import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    // שליחת הבקשה לשרת (שמריץ את index.js)
   return this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData);
  }
}
