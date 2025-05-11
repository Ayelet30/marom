import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ProvidersDetails } from '../models/providers-details.model';
import { FormsModule } from '@angular/forms';
import { HashavshevetService } from '../services/hashavshevet.service';
import { WizgroundService } from '../services/wizground.service';

@Component({
  selector: 'app-provider-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-table.component.html',
  styleUrls: [ './provider-table.component.css']
})
export class ProviderTableComponent implements OnInit {
  @Input() managerMode: boolean = false;

  data: ProvidersDetails[] = [];
  filteredData: ProvidersDetails[] = [];
  currentPageData: ProvidersDetails[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedSupplier: ProvidersDetails | undefined;
  editingSupplier: ProvidersDetails | undefined;
  isEditing: boolean = false;

  constructor(private firestoreService: FirestoreService,
              private hashavshevetService: HashavshevetService,
              private wizground: WizgroundService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {

    // this.hashavshevetService.getCustomers().subscribe({
    //   next: data => console.log('לקוחות:', data),
    //   error: err => console.error('שגיאה:', err)
    // });
    this.wizground.sendData().subscribe(
      (res) => console.log('Response:', res),
      (err) => console.error('Error:', err)
    );
    

    
    // כאן ניתן לטעון נתונים מהשרת או ממקור אחר
    const providers = await this.firestoreService.getDocuments('providers');

    if (providers.length > 0) {
      // המרה: קבלת הנתונים מתוך כל DocumentSnapshot
      this.data = providers.map((docSnap) => {
        const data = docSnap;
        return {
          name: data!['name'],
          supplierId: data!['supplierId'],
          email: data!['email'],
          phone: data!['phone'],
          address: data!['address'],
          bankNumber: data!['bankNumber'],
          branchNumber: data!['branchNumber'],
          accountNumber: data!['accountNumber'],
          DateHoldingTaxEffect: data!['DateHoldingTaxEffect'],
          DeductionPercentage: data!['DeductionPercentage'],
          incomeTaxFile: data!['incomeTaxFile'],
          ProjectName: data!['ProjectName'],
          BagType: data!['BagType'],
          Occupation: data!['Occupation'],
          NameFromCompany: data!['NameFromCompany'],
          mailFromCompany: data!['mailFromCompany'],
          NameFromMarom: data!['NameFromMarom'],
          mailFromMarom:data!['mailFromMarom']

        } as unknown as ProvidersDetails;
      });
    } else {
      this.data = [];  // אם לא התקבלו נתונים, מאתחל את data כערך ריק
    }

    this.filteredData = this.data;
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

    this.updateCurrentPageData();
  }

  async updateCurrentPageData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.currentPageData = this.filteredData.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentPageData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateCurrentPageData();
    }
  }

  filterData(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    );
    this.currentPage = 1;  // Reset to first page after filter
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.updateCurrentPageData();
  }

  selectSupplier(supplier: ProvidersDetails) {
    this.selectedSupplier = supplier;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if(this.isEditing == true)
    {
      this.editingSupplier = this.selectedSupplier;
    }
    else{
      this.updateSupplier(this.editingSupplier!);
    }
  }

  async updateSupplier(supplier: ProvidersDetails){
    console.log(supplier);
    await this.firestoreService.updateDocumentBySupplierId('providers', supplier.supplierId, supplier);
    this.loadData();
  }
}
