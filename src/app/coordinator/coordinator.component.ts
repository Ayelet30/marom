import { Component } from '@angular/core';
import { MailSenderComponent } from "../mail-sender/mail-sender.component";
import { CommonModule } from '@angular/common';
import { OpenTasksComponent } from "../open-tasks/open-tasks.component";

@Component({
    selector: 'app-coordinator',
    standalone: true,
    imports: [MailSenderComponent, CommonModule, OpenTasksComponent],
    templateUrl: './coordinator.component.html',
    styleUrls: ['./coordinator.component.css']
})
export class CoordinatorComponent {

    isEmailSenderVisible: boolean = false;
    isShowOpenTasksTable: boolean = false;
    
    SendMail() {
        this.isEmailSenderVisible = true;

    }

    arrangeOpenTasks(){
        this.isShowOpenTasksTable = true;
    }

}
