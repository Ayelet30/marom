import { Component } from '@angular/core';
import { MailSenderComponent } from "../mail-sender/mail-sender.component";
import { CommonModule } from '@angular/common';
import { OpenTasksComponent } from "../open-tasks/open-tasks.component";
import { ProviderTableComponent } from '../provider-table/provider-table.component';

@Component({
    selector: 'app-coordinator',
    standalone: true,
    imports: [MailSenderComponent, CommonModule, OpenTasksComponent, ProviderTableComponent],
    templateUrl: './coordinator.component.html',
    styleUrls: ['./coordinator.component.css']
})
export class CoordinatorComponent {

    isEmailSenderVisible: boolean = false;
    isShowOpenTasksTable: boolean = false;
    isShowOpenViewprovider: boolean = false;
    
    SendMail() {
        this.isEmailSenderVisible = true;
        this.isShowOpenTasksTable = false;
        this.isShowOpenViewprovider = false;

    }

    arrangeOpenTasks(){
        this.isShowOpenTasksTable = true;
        this.isEmailSenderVisible = false;
        this.isShowOpenViewprovider = false;
    }

    viewAllprovider(){
        this.isShowOpenViewprovider = true;
        this.isShowOpenTasksTable = false;
        this.isEmailSenderVisible = false;

    }

}
