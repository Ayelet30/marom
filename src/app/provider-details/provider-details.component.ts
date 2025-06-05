
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from "../custom-input/custom-input.component";
import { InputData } from '../models/input-data.model';
import { FirestoreService } from '../services/firestore.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierService } from '../services/supplier.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { ProvidersDetails } from '../models/providers-details.model';
import { buildPluginData } from '../shared/utils';
import { WizgroundService } from '../services/wizground.service';
import { Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';





@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomInputComponent, SpinnerComponent, RouterModule],
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.css']

})

export class ProviderDetailsComponent  {

  myForm!: FormGroup;
  currentStep: number = 1;
  showErrorForm: boolean = false;
  showSuccsesForm: boolean = false;

  @Input() isEditMode: boolean = true; // הוספת משתנה למצב עריכה
  @Input() taxFileNum!: InputData;
  @Input() branchNumber!: InputData;
  @Output() backClicked = new EventEmitter<void>();
  @Input() isStandalone: boolean = false; //דגל לבדיקה מאיפה מגיעים לprovider-details


  

  supplierData: any;

  constructor(private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private wizground: WizgroundService,
    private location: Location
   )  {
  this.supplierData = this.supplierService.getSupplier();
}

    
   goBack() {
  console.log('🔙 לחיצה על כפתור חזור');
          console.log(this.isStandalone);


  if (this.isStandalone) {
//this.router.navigate(['/supplier']); //לא עובד 
   window.location.href = '/supplier'; //פתרון מוזר לא מרוצה ממנו 
  // this.location.back(); // חזרה רגילה אם נכנסנו דרך ראוט
  } else {
    this.backClicked.emit(); // חזרה לתוך קומפוננטת האב
  }
}

  provider: ProvidersDetails = {
    accountKey: "",
    sortGroup: "89",
    taxFileNum: '',
    fullName: '',
    bankNumber: '',
    branchNumber: '',
    accountNumber: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    DateHoldingTaxEffect: '',
    DeductionPercentage: '',
    deductFile: '',
    ProjectName: '',
    BagType: '',
    Occupation: '',
    NameFromCompany: '',
    mailFromCompany: '',
    NameFromMarom: '',
    mailFromMarom: '',
  };

  inputModel: any;

  inputNameModel: InputData = {
    id: 'name',
    label: ' שם ספק',
    value: '',
    type: 'text',
    name: "name",
    error: "יש להכניס שם ספק"
  };

  inputBankNumberModel: InputData = {
    id: 'bankNumber',
    label: ' מס בנק',
    value: '',
    type: 'select',
    name: "bankNumber",
    error: "יש להכניס בנק מהרשימה בלבד"
  };

  inputAccountNumberModel: InputData = {
    id: 'accountNumber',
    label: ' מס חשבון',
    value: '',
    type: 'number',
    name: "accountNumber",
    error: "יש להכניס מס חשבון"
  };

  inputAddressModel: InputData = {
    id: 'address',
    label: ' כתובת',
    value: '',
    type: 'text',
    name: "address",
    error: "יש להכניס כתובת"
  };

  inputCityModel: InputData = {
    id: 'city',
    label: ' עיר',
    value: '',
    type: 'text',
    name: "city",
    error: "יש להכניס עיר"
  };

  inputPhoneModel: InputData = {
    id: 'phone',
    label: ' פלאפון',
    value: '',
    type: 'tel',
    name: "phone",
    error: "מס פלאפון לא חוקי"
  };

  inputEmailModel: InputData = {
    id: 'email',
    label: ' מייל',
    value: '',
    type: 'email',
    name: "email",
    error: "מייל לא חוקי"
  };

  inputWithDateHoldingTaxEffectModel: InputData = {
    id: 'dateHoldingTax',
    label: 'תוקף ניכוי במקור  ',
    value: '',
    type: 'date',
    name: "dateHoldingTax",
    error: "תאריך לא חוקי"
  };

  inputDeductionPercentageModel: InputData = {
    id: 'deductionPercentage',
    label: ' אחוז ניכוי',
    value: '',
    type: 'number',
    name: "deductionPercentage",
    error: "מס לא חוקי"
  };

  inputdeductFileModel: InputData = {
    id: 'deductFile',
    label: 'תיק מס הכנסה',
    value: '',
    type: 'text',
    name: "deductFile",
    error: "לא חוקי",
    maxlength: '9'
  };

  inputProjectNameModel: InputData = {
    id: 'ProjectName',
    label: 'שם הפרויקט ',
    value: '',
    type: 'text',
    name: "ProjectName",
    error: "לא חוקי"
  };

  inputBagTypeModel: InputData = {
    id: 'BagType',
    label: 'סוג התיק ',
    value: '',
    type: 'select',
    name: "BagType",
    error: "יש לבחור סוג מהרשימה"
  };

  inputOccupationModel: InputData = {
    id: 'Occupation',
    label: ' עיסוק',
    value: '',
    type: 'text',
    name: "Occupation",
    error: "יש להכניס עיסוק"
  };

  inputNameFromCompanyModel: InputData = {
    id: 'NameFromCompany',
    label: 'שם איש קשר מטעם הספק',
    value: '',
    type: 'text',
    name: "NameFromCompany",
    error: "שדה חובה"
  };

  inputMailFromCompanyModel: InputData = {
    id: 'MailFromCompany',
    label: ' מייל איש קשר מטעם הספק',
    value: '',
    type: 'email',
    name: "MailFromCompany",
    error: "מייל לא חוקי"
  };

  inputNameFromMaromModel: InputData = {
    id: 'NameFromMarom',
    label: ' שם איש קשר מטעם מרום',
    value: '',
    type: 'select',
    name: "NameFromMarom",
    error: "יש לבחור מרשימה"
  };

  inputMailFromMaromModel: InputData = {
    id: 'MailFromMarom',
    label: 'מייל איש קשר מטעם מרום',
    value: '',
    type: 'email',
    name: "MailFromMarom",
    error: "מייל לא חוקי",
    readonly: 'true'
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

  type = [
    { id: '1', name: 'עוסק מורשה' },
    { id: '2', name: 'חברה' },
    { id: '3', name: 'עוסק פטור' },
    { id: '4', name: 'עוסק זעיר' },
    { id: '5', name: 'עמותה' }
  ];

  fromMaromList: any[] = [];


  ngOnInit() {

    this.setMaromOwnerList();

    this.myForm = this.fb.group({
      taxFileNum: [this.taxFileNum.value, Validators.required],
      inputNameModel: [this.inputNameModel.value, Validators.required],
      inputBankNumberModel: [this.inputBankNumberModel.value, Validators.required],
      branchNumber: [this.branchNumber.value, Validators.required],
      inputAccountNumberModel: [this.inputAccountNumberModel.value, Validators.required],
      inputAddressModel: [this.inputAddressModel.value, Validators.required],
      inputCityModel: [this.inputCityModel.value, Validators.required],
      inputPhoneModel: [this.inputPhoneModel.value, [Validators.required, Validators.pattern('[0-9]{10}')]],
      inputEmailModel: [this.inputEmailModel.value, [Validators.required, Validators.email]],
      inputWithDateHoldingTaxEffectModel: [this.inputWithDateHoldingTaxEffectModel.value, Validators.required],
      inputDeductionPercentageModel: [this.inputDeductionPercentageModel.value, Validators.required],
      inputdeductFileModel: [this.inputdeductFileModel.value, Validators.required],
      inputProjectNameModel: [this.inputProjectNameModel.value, Validators.required],
      inputBagTypeModel: [this.inputBagTypeModel.value, Validators.required],
      inputOccupationModel: [this.inputOccupationModel.value, Validators.required],
      inputMailFromCompanyModel: [this.inputMailFromCompanyModel.value, Validators.required],
      inputNameFromCompanyModel: [this.inputNameFromCompanyModel.value, Validators.required],
      inputNameFromMaromModel: [this.inputNameFromMaromModel.value, Validators.required],
      inputMailFromMaromModel: [this.inputMailFromMaromModel.value, Validators.required],
      agree: [true, Validators.requiredTrue]
    });



    if (!this.isEditMode) {
      this.taxFileNum.readonly = 'true';
      this.branchNumber.readonly = 'true';
    } else {
      const supplierData = this.supplierService.getSupplier();
      if (supplierData) {
        this.fillForm(supplierData);
      } else {
        this.loadSupplierFromFirestore();
      }
    }
  }

  fillForm(supplierData: any) {
  console.log("!!!!!", supplierData);

  // עדכון ה־value של כל אובייקט InputData, כדי שיוצג בשדות
  this.inputNameModel.value = supplierData.fullName;
  console.log('שם הספק:', supplierData.fullName);
  console.log("שם לאחר העדכון:", this.inputNameModel.value);


  this.inputBankNumberModel.value = supplierData.bankNumber;
  this.branchNumber.value = supplierData.branchNumber;
  this.taxFileNum.value = supplierData.taxFileNum;
  this.inputAccountNumberModel.value = supplierData.accountNumber;
  this.inputAddressModel.value = supplierData.address;
  this.inputCityModel.value = supplierData.city;
  this.inputPhoneModel.value = supplierData.phone;
  this.inputEmailModel.value = supplierData.email;
  this.inputWithDateHoldingTaxEffectModel.value = supplierData.DateHoldingTaxEffect;
  this.inputDeductionPercentageModel.value = supplierData.DeductionPercentage;
  this.inputdeductFileModel.value = supplierData.deductFile;
  this.inputProjectNameModel.value = supplierData.ProjectName;
  this.inputBagTypeModel.value = supplierData.BagType;
  this.inputOccupationModel.value = supplierData.Occupation;
  this.inputNameFromCompanyModel.value = supplierData.NameFromCompany;
  this.inputMailFromCompanyModel.value = supplierData.mailFromCompany;
  this.inputNameFromMaromModel.value = supplierData.NameFromMarom;
  this.inputMailFromMaromModel.value = supplierData.mailFromMarom;

  // עדכון גם של ה־FormGroup
  this.myForm.patchValue({
    taxFileNum: supplierData.taxFileNum,
    inputNameModel: supplierData.fullName,
    inputBankNumberModel: supplierData.bankNumber,
    branchNumber: supplierData.branchNumber,
    inputAccountNumberModel: supplierData.accountNumber,
    inputAddressModel: supplierData.address,
    inputCityModel: supplierData.city,
    inputPhoneModel: supplierData.phone,
    inputEmailModel: supplierData.email,
    inputWithDateHoldingTaxEffectModel: supplierData.DateHoldingTaxEffect,
    inputDeductionPercentageModel: supplierData.DeductionPercentage,
    inputdeductFileModel: supplierData.deductFile,
    inputProjectNameModel: supplierData.ProjectName,
    inputBagTypeModel: supplierData.BagType,
    inputOccupationModel: supplierData.Occupation,
    inputNameFromCompanyModel: supplierData.NameFromCompany,
    inputMailFromCompanyModel: supplierData.mailFromCompany,
    inputNameFromMaromModel: supplierData.NameFromMarom,
    inputMailFromMaromModel: supplierData.mailFromMarom,
  });
}

  async setMaromOwnerList() {
    const ownersData = await this.firestoreService.getDocuments('/coordinators');
    this.fromMaromList = ownersData.map((doc: any) => ({
      id: doc.coordinatorId,
      name: doc.name,
      email: doc.email
    }));
    console.log("0000", this.fromMaromList);
  }

  onOwnerChange(event: any) {
    const selectedValue = event.target.value;
    const selectedOwner = this.fromMaromList.find(owner => owner.id === selectedValue);
    this.inputMailFromMaromModel.value = selectedOwner.email ? selectedOwner.email : '';
    this.myForm.patchValue({
      inputMailFromMaromModel: selectedOwner.email ? selectedOwner.email : '',
    });
  }


  async loadSupplierFromFirestore() {
    try {
      const supplierData = await this.firestoreService.getDocumentByParameter('providers', "taxFileNum", this.taxFileNum.value);
      if (supplierData) {
        this.myForm.patchValue(supplierData);
      }
    } catch (error) {
      console.error('Error loading supplier data:', error);
    }
  }

  getFormControl(name: string): FormControl {
    return this.myForm.get(name) as FormControl;
  }

  onSubmit() {

    this.showErrorForm = false;
    this.provider = {
      accountKey: "",
      sortGroup: "89",
      taxFileNum: this.myForm.get('taxFileNum')?.value,
      fullName: this.myForm.get('inputNameModel')?.value,
      bankNumber: this.myForm.get('inputBankNumberModel')?.value,
      branchNumber: this.myForm.get('branchNumber')?.value,
      accountNumber: this.myForm.get('inputAccountNumberModel')?.value,
      address: this.myForm.get('inputAddressModel')?.value,
      city: this.myForm.get('inputCityModel')?.value,
      phone: this.myForm.get('inputPhoneModel')?.value,
      email: this.myForm.get('inputEmailModel')?.value,
      DateHoldingTaxEffect: this.myForm.get('inputWithDateHoldingTaxEffectModel')?.value,
      DeductionPercentage: this.myForm.get('inputDeductionPercentageModel')?.value,
      deductFile: this.myForm.get('inputdeductFileModel')?.value,
      ProjectName: this.myForm.get('inputProjectNameModel')?.value,
      BagType: this.myForm.get('inputBagTypeModel')?.value,
      Occupation: this.myForm.get('inputOccupationModel')?.value,
      NameFromCompany: this.myForm.get('inputNameFromCompanyModel')?.value,
      mailFromCompany: this.myForm.get('inputMailFromCompanyModel')?.value,
      NameFromMarom: this.myForm.get('inputNameFromMaromModel')?.value,
      mailFromMarom: this.myForm.get('inputMailFromMaromModel')?.value,
    };

    if (!this.myForm.valid) {
      console.log('Form not Submitted:', this.myForm.value);
      this.showErrorForm = true;
      return;
    }
    else {
      this.showSuccsesForm = true;
    }

    if (this.isEditMode) {
      this.updateSupplier();
    } else {
      this.addSupplier();
    }
  }

 async addSupplier() {
  try {
    const taxFileNum = await this.firestoreService.addSupplierWithAutoAccountKey('providers', this.provider);
    console.log('Supplier added with ID:', taxFileNum, this.provider);
    this.supplierService.setSupplier(this.provider);
    this.addSupplierToHashavshevet(this.provider);

    setTimeout(() => {
      this.router.navigate(['/addDocuments']);
    }, 3000);

  } catch (error) {
    console.error('Error adding supplier:', error);
  }
}


  addSupplierToHashavshevet(provider: ProvidersDetails) {
    const fields = [
  { key: "sortGroup", value: provider.sortGroup },
  { key: "accountKey", value: provider.accountKey },
  { key: "taxFileNum", value: provider.taxFileNum },
  { key: "fullName", value: provider.fullName },
  { key: "bankCode", value: provider.bankNumber },
  { key: "branchCode", value: provider.branchNumber },
  { key: "bankAccount", value: provider.accountNumber },
  { key: "Address", value: provider.address },
  { key: "City", value: provider.city },
  { key: "Phon", value: provider.phone },
  { key: "Email", value: provider.email },
  // { key: "deductionValid", value: new Date(provider.DateHoldingTaxEffect) },
  { key: "deductionPrc", value: parseFloat(provider.DeductionPercentage).toFixed(2) },
  { key: "deductFile", value: provider.deductFile }
];

 const pluginData = [buildPluginData(fields)];
        this.wizground.sendData(pluginData, "heshin").subscribe(
      (res) => console.log('Response:', res),
      (err) => console.error('Error:', err));

  }

  async updateSupplier() {
    try {
      await this.firestoreService.updateDocumentByTaxFileNum('providers', this.provider.taxFileNum, this.provider);
      console.log('Supplier updated:', this.provider);
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  }

  prevStep() {
    this.currentStep--;
  }
  nextStep() {
    this.currentStep++;
  }

  cleanForm() {

    this.inputNameModel.value = '';
    this.inputBankNumberModel.value = '';
    this.branchNumber.value = '';
    this.taxFileNum.value = '';
    this.inputAccountNumberModel.value = '';
    this.inputAddressModel.value = '';
    this.inputCityModel.value = '';
    this.inputPhoneModel.value = '';
    this.inputEmailModel.value = '';
  }

  isOptionSelected(option: number): boolean {
    return this.myForm.get('inputBagTypeModel')?.value === option.toString;
  }

}
