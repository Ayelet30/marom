import { Component } from '@angular/core';
import { ProviderTableComponent } from '../provider-table/provider-table.component';
import { IssuanceDemandComponent } from '../issuance-demand/issuance-demand.component';
import { MergeExpensesComponent } from '../merge-expenses/merge-expenses.component';
import { FirestoreService } from '../services/firestore.service';
import { InputData } from '../models/input-data.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-manager',
    standalone: true,
    imports: [ProviderTableComponent, IssuanceDemandComponent,
        MergeExpensesComponent, CommonModule, FormsModule],
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

    id: string = '';
    isAdmin: boolean = false;
    currentComponent: string = '';
    isError: boolean = false;
    error: string = "";


    constructor(private firestoreService: FirestoreService) { }

    async checkId() {
        const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId', this.id);
        if (!coordinatorData) {
            this.isError = true;
            this.isAdmin = false;
            this.error = "מצטערים אין משתמש כזה.."
        }
        else {
            this.isAdmin = coordinatorData.role === 'מנהל';
            if (this.isAdmin) {
                this.isError = false;
                this.error = ""
            }
            else {
                this.isError = true;
                this.error = "מצטערים אתה לא המנהל.."
            }
        }


    }

    showComponent(component: string) {
        this.currentComponent = component;
    }

}
