import { Component } from '@angular/core';
import { ProviderTableComponent } from '../provider-table/provider-table.component';
import { IssuanceDemandComponent } from '../issuance-demand/issuance-demand.component';
import { MergeExpensesComponent } from '../merge-expenses/merge-expenses.component';
import { FirestoreService } from '../services/firestore.service';
import { InputData } from '../models/input-data.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../custom-input/custom-input.component';


@Component({
    selector: 'app-manager',
    standalone: true,
    imports: [ProviderTableComponent, IssuanceDemandComponent,
        MergeExpensesComponent, CommonModule, FormsModule , CustomInputComponent ],
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

    //id: string = '';
    isAdmin: boolean = false;
    currentComponent: string = '';
    isError: boolean = false;
    error: string = "";
    adminIdModel: InputData = {
  id: 'adminId',
  label: 'קוד מנהל',
  value: '',
  type: 'text',
  name: 'adminId',
  error: 'יש להזין לפחות 5 תווים',
  maxlength: '20'
};
adminIdControl = new FormControl('', [Validators.required, Validators.minLength(5)]);



    constructor(private firestoreService: FirestoreService) { }

    async checkId() {
  const id = this.adminIdControl.value?.trim();
  if (!id) {
    this.isError = true;
    this.error = "יש להזין קוד מנהל";
    return;
  }

  const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId', id);
  if (!coordinatorData) {
    this.isError = true;
    this.isAdmin = false;
    this.error = "קוד מנהל שגוי / לא קיים";
  } else {
    this.isAdmin = coordinatorData.role === 'מנהל';
    this.isError = !this.isAdmin;
    this.error = this.isAdmin ? "" : "מצטערים אתה לא המנהל..";
  }
}


    showComponent(component: string) {
        this.currentComponent = component;
    }

}
