import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { ProviderDetailsComponent } from "../provider-details/provider-details.component";
import { CustomInputComponent } from "../custom-input/custom-input.component";
import { InputData } from '../models/input-data.model';
import { AuthService } from '../services/auth.service';
import { DocumentData } from 'firebase/firestore';
import { SupplierService } from '../services/supplier.service';


@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomInputComponent, RouterModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  supplierForm!: FormGroup;
  supplierData: any = null;
  showAddNewForm: boolean = false;
  showMessage: boolean = false;
  showModal: boolean = false;  // להציג/להסתיר את המודאל


  inputIDModel: InputData = {
    id: 'licenseNumber',
    label: 'מספר עוסק מורשה',
    value: '',
    type: 'number',
    name: "licenseNumber",
    error: "יש להכניס 9 ספרות",
    maxlength: '9'
  };

  inputBranchNumberModel: InputData = {
    id: 'branchNumber',
    label: ' מס סניף בנק',
    value: '',
    type: 'number',
    name: "branchNumber",
    error: "יש להכניס 3 ספרות",
    maxlength: '9'
  };

  email: string = 'ayelethury@gmail.com';
  password: string = 'ayelethury';
  errorMessage: string = 'שם משתמש וסיסמא שגויה!';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthService,
    private supplierService: SupplierService
  ) {
  }
  //   // AY13579
  ngOnInit(): void {

    this.login();
    this.supplierForm = this.fb.group({
      inputIDModel: [this.inputIDModel.value, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      inputBranchNumberModel: [this.inputBranchNumberModel.value, [Validators.required, Validators.pattern(/^\d{3}$/)]],
      agree: [true, Validators.requiredTrue]
    });
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log('התחברות הצליחה!');
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('שגיאת התחברות:', error);
    }
  }

  getFormControl(name: string): FormControl {
    return this.supplierForm.get(name) as FormControl;
  }

  async checkSupplier() {
    if (this.supplierForm.invalid) {
      return;
    }

    const taxFileNum = this.supplierForm.value.inputIDModel;
    const branchNumber = this.supplierForm.value.inputBranchNumberModel;

    if (!taxFileNum) {
      console.error('Error: taxFileNum is undefined');
      return;
    }

    // עדכון המודלים עם הערכים שהוזנו בטופס
    this.inputIDModel.value = taxFileNum;
    this.inputBranchNumberModel.value = branchNumber;

    this.supplierData = await this.firestoreService.getDocumentByParameter('providers', "taxFileNum", taxFileNum);

    console.log(this.supplierData)

    if (this.supplierData && this.supplierData.branchNumber === branchNumber) {
      this.showAddNewForm = false; // הספק נמצא
      this.supplierService.setSupplier(this.supplierData);
      this.navigateToExistProvider();
    } else {
      this.supplierService.setSupplier(undefined);
    this.showModal = true;  // פותח את המודאל
      // setTimeout(() => {
      //   this.showMessage = false;
      //   this.showAddNewForm = true;
      //   this.navigateToProviderDetails();  // הצגת הטופס לאחר 3 שניות
      // }, 5000);
    }
  }


  navigateToExistProvider() {
    this.router.navigate(['/existProvider']);
  }

  navigateToProviderDetails() {
    this.router.navigate([
      '/provider-details/new',
      this.inputIDModel.value,
      this.inputBranchNumberModel.value
    ]);
  }

  onBackFromEdit() {
    this.showAddNewForm = false;
  }
onConfirmCreateNew() {
  this.showModal = false;
  this.navigateToProviderDetails();
}

onCancelCreateNew() {
  this.showModal = false;
this.supplierForm.reset({
    inputIDModel: '',
    inputBranchNumberModel: '',
    agree: true  // חשוב! אחרת הכפתור נשאר מושבת
  });}


}

