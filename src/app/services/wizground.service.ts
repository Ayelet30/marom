import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WizgroundService {
  constructor(private http: HttpClient) {}

  sendData() {
    return this.http.post('http://localhost:3000/api/send-wizground', {});
  }
}
