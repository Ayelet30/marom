
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


@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomInputComponent, SpinnerComponent, RouterModule],
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.css']

})

export class NewProviderComponent {

  myForm!: FormGroup;
  currentStep: number = 1;
  showErrorForm: boolean = false;
  showSuccsesForm: boolean = false;

  @Input() isEditMode: boolean = false; // הוספת משתנה למצב עריכה
  @Input() supplierId!: InputData;
  @Input() branchNumber!: InputData;

  constructor(private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router) { }

  provider: ProvidersDetails = {
    supplierId: '',
    name: '',
    bankNumber: '',
    branchNumber: '',
    accountNumber: '',
    address: '',
    phone: '',
    email: '',
    DateHoldingTaxEffect: '',
    DeductionPercentage: '',
    incomeTaxFile: '',
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

  inputIncomeTaxFileModel: InputData = {
    id: 'incomeTaxFile',
    label: 'תיק מס הכנסה',
    value: '',
    type: 'text',
    name: "incomeTaxFile",
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
      supplierId: [this.supplierId.value, Validators.required],
      inputNameModel: [this.inputNameModel.value, Validators.required],
      inputBankNumberModel: [this.inputBankNumberModel.value, Validators.required],
      branchNumber: [this.branchNumber.value, Validators.required],
      inputAccountNumberModel: [this.inputAccountNumberModel.value, Validators.required],
      inputAddressModel: [this.inputAddressModel.value, Validators.required],
      inputPhoneModel: [this.inputPhoneModel.value, [Validators.required, Validators.pattern('[0-9]{10}')]],
      inputEmailModel: [this.inputEmailModel.value, [Validators.required, Validators.email]],
      inputWithDateHoldingTaxEffectModel: [this.inputWithDateHoldingTaxEffectModel.value, Validators.required],
      inputDeductionPercentageModel: [this.inputDeductionPercentageModel.value, Validators.required],
      inputIncomeTaxFileModel: [this.inputIncomeTaxFileModel.value, Validators.required],
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
      this.supplierId.readonly = 'true';
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
    this.myForm.patchValue({
      supplierId: supplierData.supplierId,
      inputNameModel: supplierData.name,
      inputBankNumberModel: supplierData.bankNumber,
      branchNumber: supplierData.branchNumber,
      inputAccountNumberModel: supplierData.accountNumber,
      inputAddressModel: supplierData.address,
      inputPhoneModel: supplierData.phone,
      inputEmailModel: supplierData.email,
      inputWithDateHoldingTaxEffectModel: supplierData.DateHoldingTaxEffect,
      inputDeductionPercentageModel: supplierData.DeductionPercentage,
      inputIncomeTaxFileModel: supplierData.incomeTaxFile,
      inputProjectNameModel: supplierData.ProjectName,
      inputBagTypeModel: supplierData.BagType,
      inputOccupationModel: supplierData.Occupation,
      inputNameFromCompanyModel: supplierData.NameFromCompany,
      inputMailFromCompanyModel: supplierData.mailFromCompany,
      inputNameFromMaromModel: supplierData.NameFromMarom,
      inputMailFromMaromModel: supplierData.mailFromMarom,
    });
  }

  async setMaromOwnerList(){
    const ownersData = await this.firestoreService.getDocuments('/coordinators');
    this.fromMaromList  = ownersData.map((doc: any) => ({
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
    this.myForm.patchValue({ inputMailFromMaromModel: selectedOwner.email ? selectedOwner.email : '',
    });
  }
  

  async loadSupplierFromFirestore() {
    try {
      const supplierData = await this.firestoreService.getDocumentByParameter('providers', "supplierId", this.supplierId.value);
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
      supplierId: this.myForm.get('supplierId')?.value,
      name: this.myForm.get('inputNameModel')?.value,
      bankNumber: this.myForm.get('inputBankNumberModel')?.value,
      branchNumber: this.myForm.get('branchNumber')?.value,
      accountNumber: this.myForm.get('inputAccountNumberModel')?.value,
      address: this.myForm.get('inputAddressModel')?.value,
      phone: this.myForm.get('inputPhoneModel')?.value,
      email: this.myForm.get('inputEmailModel')?.value,
      DateHoldingTaxEffect: this.myForm.get('inputWithDateHoldingTaxEffectModel')?.value,
      DeductionPercentage: this.myForm.get('inputDeductionPercentageModel')?.value,
      incomeTaxFile: this.myForm.get('inputIncomeTaxFileModel')?.value,
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
      const supplierId = await this.firestoreService.addSupplier('providers', this.provider);
      console.log('Supplier added with ID:', supplierId,this.provider );
      this.supplierService.setSupplier(this.provider);

      setTimeout(() => {
        this.router.navigate(['/addDocuments']);
      }, 3000);
      

    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  }

  async updateSupplier() {
    try {
      await this.firestoreService.updateDocumentBySupplierId('providers', this.provider.supplierId, this.provider);
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
    this.supplierId.value = '';
    this.inputAccountNumberModel.value = '';
    this.inputAddressModel.value = '';
    this.inputPhoneModel.value = '';
    this.inputEmailModel.value = '';
  }

  isOptionSelected(option: number): boolean {
    return this.myForm.get('inputBagTypeModel')?.value === option.toString;
}

}