import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ProvidersDetails } from '../models/providers-details.model';
import { FormsModule } from '@angular/forms';
import { WizgroundService } from '../services/wizground.service';

@Component({
  selector: 'app-provider-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-table.component.html',
  styleUrls: ['./provider-table.component.css'],

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
  fieldErrors: Partial<Record<keyof ProvidersDetails, string>> = {};
  successMessageVisible: boolean = false;




  constructor(private firestoreService: FirestoreService,
    private wizground: WizgroundService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {

    // const data = [{"ItemKey": "A2000"}];

    // this.wizground.sendData(data, "itemin").subscribe(
    //   (res) => console.log('Response:', res),
    //   (err) => console.error('Error:', err)
    // );



    // כאן ניתן לטעון נתונים מהשרת או ממקור אחר
    const providers = await this.firestoreService.getDocuments('providers');

    if (providers.length > 0) {
      // המרה: קבלת הנתונים מתוך כל DocumentSnapshot
      this.data = providers.map((docSnap) => {
        const data = docSnap;
        return {
          sortGroup: data['sortGroup'],
          accountKey: data['accountKey'],
          fullName: data!['fullName'],
          taxFileNum: data!['taxFileNum'],
          email: data!['email'],
          phone: data!['phone'],
          address: data!['address'],
          city: data['city'],
          bankNumber: data!['bankNumber'],
          branchNumber: data!['branchNumber'],
          accountNumber: data!['accountNumber'],
          DateHoldingTaxEffect: data!['DateHoldingTaxEffect'],
          DeductionPercentage: data!['DeductionPercentage'],
          deductFile: data!['deductFile'],
          ProjectName: data!['ProjectName'],
          BagType: data!['BagType'],
          Occupation: data!['Occupation'],
          NameFromCompany: data!['NameFromCompany'],
          mailFromCompany: data!['mailFromCompany'],
          NameFromMarom: data!['NameFromMarom'],
          mailFromMarom: data!['mailFromMarom']

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
    console.log("@@@@@@@", this.currentPageData);
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
      (item.fullName || '').toLowerCase().includes(query) ||
      (item.email || '').toLowerCase().includes(query) ||
      (item.taxFileNum || '').toLowerCase().includes(query) ||
      (item.accountKey || '').toLowerCase().includes(query) ||
      (item.phone || '').toLowerCase().includes(query) ||
      (item.address || '').toLowerCase().includes(query) ||
      (item.Occupation || '').toLowerCase().includes(query) ||
      (item.NameFromCompany || '').toLowerCase().includes(query)
    );

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.updateCurrentPageData();
  }

  selectSupplier(supplier: ProvidersDetails) {
    this.selectedSupplier = supplier;
    console.log("!!!!!!!!", this.selectedSupplier);
  }

  async toggleEditMode() {
    if (this.isEditing) {
      // אם בלחיצה על שמור
      if (this.editingSupplier && this.validateSupplierFields(this.editingSupplier)) {
        // ממתינה לסיום עדכון במסד
        await this.updateSupplier(this.editingSupplier);

        // מעדכנת את הספק הנבחר להצגת הערכים החדשים
        this.selectedSupplier = { ...this.editingSupplier };

        // יוצאת ממצב עריכה
        this.isEditing = false;

      } else {
        return; // אם הייתה שגיאה - לא יוצאת ממצב עריכה
      }
    } else {
      // אם בלחיצה על ערוך
      this.editingSupplier = {
        sortGroup: this.selectedSupplier?.sortGroup || '',
        accountKey: this.selectedSupplier?.accountKey || '',
        fullName: this.selectedSupplier?.fullName || '',
        taxFileNum: this.selectedSupplier?.taxFileNum || '',
        email: this.selectedSupplier?.email || '',
        phone: this.selectedSupplier?.phone || '',
        address: this.selectedSupplier?.address || '',
        city: this.selectedSupplier?.city || '',
        bankNumber: this.selectedSupplier?.bankNumber || '',
        branchNumber: this.selectedSupplier?.branchNumber || '',
        accountNumber: this.selectedSupplier?.accountNumber || '',
        DateHoldingTaxEffect: this.selectedSupplier?.DateHoldingTaxEffect || '',
        DeductionPercentage: this.selectedSupplier?.DeductionPercentage || '',
        deductFile: this.selectedSupplier?.deductFile || '',
        ProjectName: this.selectedSupplier?.ProjectName || '',
        BagType: this.selectedSupplier?.BagType || '',
        Occupation: this.selectedSupplier?.Occupation || '',
        NameFromCompany: this.selectedSupplier?.NameFromCompany || '',
        mailFromCompany: this.selectedSupplier?.mailFromCompany || '',
        NameFromMarom: this.selectedSupplier?.NameFromMarom || '',
        mailFromMarom: this.selectedSupplier?.mailFromMarom || ''
      };

      this.isEditing = true;
    }
  }

  async updateSupplier(supplier: ProvidersDetails) {
    console.log(supplier);
    await this.firestoreService.updateDocumentByTaxFileNum('providers', supplier.taxFileNum, supplier);
    this.loadData();
  }
  validateSupplierFields(supplier: ProvidersDetails): boolean {
  this.fieldErrors = {};

  this.validateField('sortGroup');
  this.validateField('accountKey');

  return Object.keys(this.fieldErrors).length === 0;
}

 validateField(field: keyof ProvidersDetails) {
  if (!this.editingSupplier) return;

  const value = this.editingSupplier[field]?.toString().trim() ?? '';
  const numberRegex = /^\d+$/;

  // איפוס שגיאה קודמת
  delete this.fieldErrors[field];

  // שלב ראשון: בדיקה אם ריק
  if (!value) {
    this.fieldErrors[field] = 'נדרש להכניס ערך';
    return;
  }

  // שלב שני: בדיקה אם אמור להכיל רק מספרים
  if ((field === 'sortGroup' || field === 'accountKey' ) && !numberRegex.test(value)) {
    this.fieldErrors[field] = 'יש להזין ספרות בלבד';
  }
}








}
