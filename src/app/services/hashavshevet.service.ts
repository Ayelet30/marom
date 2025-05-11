import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HashavshevetService {  
    
  private hashav = environment.hashavshevet;
  private baseUrl = environment.hashavshevet.apiUrl;

  constructor(private http: HttpClient) {
  }

private getHeaders() {
  return new HttpHeaders({
    'Authorization': `Bearer ${this.hashav.token}`,
    'Content-Type': 'application/json',
    'stationid': this.hashav.stationId,
    'company': this.hashav.company,
    'username': this.hashav.username
  });
}


  // דוגמה לקריאה פשוטה - קבלת לקוחות
  getCustomers() {
    const url = `${this.baseUrl}/customer`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // דוגמה לשליחת חשבונית
  createInvoice(invoiceData: any) {
    const url = `${this.baseUrl}/invoice`;
    return this.http.post(url, invoiceData, { headers: this.getHeaders() });
  }
}
