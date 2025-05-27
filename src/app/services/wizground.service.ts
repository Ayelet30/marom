import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WizgroundService {

   private apiUrl = 'http://localhost:3000/api/send-wizground';

  constructor(private http: HttpClient) {}

  sendData(moduleData: any[], plugin: string) {
    return this.http.post(this.apiUrl, {
      moduleData,
      plugin
    });
  }
}
