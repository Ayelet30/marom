import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private supplierData: any = null;

  setSupplier(data: any) {
    this.supplierData = data;
  }

  getSupplier() {
    return this.supplierData;
  }
}
