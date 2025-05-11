// email.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'https://us-central1-marom-9f242.cloudfunctions.net/sendMail';

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, text: string) {
    return this.http.post(this.apiUrl, { to, subject, text });
  }
}
