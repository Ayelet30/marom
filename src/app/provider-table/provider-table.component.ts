import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ProvidersDetails } from '../models/providers-details.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WizgroundService } from '../services/wizground.service';
import { CustomInputComponent } from "../custom-input/custom-input.component";

@Component({
  selector: 'app-provider-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './provider-table.component.html',
  styleUrls: ['./provider-table.component.css'],

})
export class ProviderTableComponent implements OnInit {
  getFormControl(name: string): FormControl {
    if (!this.form.contains(name)) {
      const initialValue = this.editingSupplier?.[name as keyof ProvidersDetails] || '';
      this.form.addControl(name, new FormControl(initialValue));
    }
    return this.form.get(name) as FormControl;
  }

  @Input() managerMode: boolean = false;

  data: ProvidersDetails[] = [];
  filteredData: ProvidersDetails[] = [];
  currentPageData: ProvidersDetails[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedSupplier: ProvidersDetails | undefined;
  editingSupplier?: ProvidersDetails;
  isEditing: boolean = false;
  fieldErrors: Partial<Record<keyof ProvidersDetails, string>> = {};
  successMessageVisible: boolean = false;
  inputBankNumberModel = {
    id: 'bankNumber',
    name: 'bankNumber',
    label: 'בחר בנק',
    type: 'select',
    value: this.editingSupplier?.bankNumber || '',
  };

  bankList = [
    { id: '10', name: 'בנק לאומי' },
    { id: '11', name: 'בנק דיסקונט' },
    { id: '12', name: 'בנק הפועלים' },
    { id: '20', name: 'בנק מזרחי טפחות' },
    { id: '31', name: 'בנק הבינלאומי' },
    { id: '14', name: 'בנק אוצר החייל' },
    { id: '17', name: 'בנק מרכנתיל דיסקונט' },
    { id: '9', name: 'בנק הדואר' },
    { id: '13', name: 'בנק איגוד' },
    { id: '46', name: 'בנק מסד' },
    { id: '52', name: 'בנק פועלי אגודת ישראל ' },
    { id: '90', name: 'בנק דיסקונט למשכנתאות' },
    { id: '77', name: 'בנק לאומי למשכנתאות' },
    { id: '04', name: 'בנק יהב' },
    { id: '26', name: 'בנק יובנק' },
    { id: '07', name: 'בנק לפיתוח התעשיה' },
    { id: '08', name: 'בנק הספנות ישראל' },
    { id: '06', name: 'בנק אדנים' },
    { id: '54', name: 'בנק ירושלים ' },
    { id: '34', name: 'בנק ערבי ישראל ' },
    { id: '01', name: 'בנק יורו טרייד' },
    { id: '19', name: 'בנק החקלאות לישראל' },
    { id: '22', name: 'בנק סיטי' }
  ];

  form: FormGroup = new FormGroup({});




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
    this.validateBranchNumber();
    this.validateAccountNumber();
    this.validatePhone();
    this.validateEmail();
    this.validateDeductionPercentage();




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
    if ((field === 'sortGroup' || field === 'accountKey') && !numberRegex.test(value)) {
      this.fieldErrors[field] = 'יש להזין ספרות בלבד';
    }
  }

  onBankChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    if (this.editingSupplier) {
      this.editingSupplier.bankNumber = target.value;
    }
  }
  getBankNameById(id: string): string {
    const bank = this.bankList.find(b => b.id === id);
    return bank ? bank.name : '';
  }
  validateBranchNumber() {
    if (!this.editingSupplier) return;

    const value = this.editingSupplier.branchNumber?.toString().trim() ?? '';

    // איפוס שגיאה קיימת
    delete this.fieldErrors.branchNumber;

    if (!value) {
      this.fieldErrors.branchNumber = 'נדרש להזין מספר סניף';
    } else if (!/^\d+$/.test(value)) {
      this.fieldErrors.branchNumber = 'יש להזין ספרות בלבד';
    } else if (value.length !== 3) {
      this.fieldErrors.branchNumber = 'מספר סניף חייב להכיל 3 ספרות בדיוק';
    }
  }
  validateAccountNumber() {
    if (!this.editingSupplier) return;

    const value = this.editingSupplier.accountNumber?.toString().trim() ?? '';

    delete this.fieldErrors.accountNumber;

    if (!value) {
      this.fieldErrors.accountNumber = 'נדרש להזין מספר חשבון';
    } else if (!/^\d+$/.test(value)) {
      this.fieldErrors.accountNumber = 'יש להזין ספרות בלבד';
    } else if (value.length < 5 || value.length > 10) {
      this.fieldErrors.accountNumber = 'מספר חשבון צריך להכיל בין 5 ל-10 ספרות';
    }
  }
  validatePhone() {
    if (!this.editingSupplier) return;

    const value = this.editingSupplier.phone?.toString().trim() ?? '';

    delete this.fieldErrors.phone;

    if (!value) {
      this.fieldErrors.phone = 'נדרש להזין מספר פלאפון';
    } else if (!/^05\d{8}$/.test(value)) {
      this.fieldErrors.phone = 'מספר פלאפון צריך להתחיל ב־05 ולהכיל 10 ספרות';
    }
  }

  validateEmail() {
    if (!this.editingSupplier) return;

    const value = this.editingSupplier.email?.toString().trim() ?? '';

    delete this.fieldErrors.email;

    if (!value) {
      this.fieldErrors.email = 'נדרש להזין כתובת מייל';
    } else if (
      !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      this.fieldErrors.email = 'כתובת מייל אינה תקינה';
    }
  }


validateDeductionPercentage() {
  if (!this.editingSupplier) return;

  const value = this.editingSupplier.DeductionPercentage?.toString().trim() ?? '';
  delete this.fieldErrors.DeductionPercentage;

  if (!value) {
    this.fieldErrors.DeductionPercentage = 'נדרש להזין אחוז ניכוי';
  } else if (!/^\d+(\.\d+)?$/.test(value)) {
    this.fieldErrors.DeductionPercentage = 'יש להזין מספר חוקי';
  } else {
    const numericValue = parseFloat(value);
    if (numericValue < 0 || numericValue > 100) {
      this.fieldErrors.DeductionPercentage = 'הערך חייב להיות בין 0 ל-100';
    }
  }
}







}
