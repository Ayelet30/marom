import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // שליחת הבקשה לשרת (שמריץ את index.js)
    return this.http.post<{ url: string }>('http://localhost:3500/upload', formData);
  }
}
