import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './open-tasks.component.html',
  styleUrls: ['./open-tasks.component.css']
})
export class OpenTasksComponent {
  coordinatorId = '';
  tasks: any[] = [];
  loading = false;

  constructor(private firestoreService: FirestoreService) {}

  async loadTasks() {
     if (!this.coordinatorId) return;

     this.loading = true;
     const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId' ,this.coordinatorId);
     const data = await this.firestoreService.getDocumentsByParameter('tasks', 'owner', this.coordinatorId);
     if (data) {
      // ממיר את הנתונים לפורמט מתאים
      this.tasks = data.map((doc: any) => doc.data()); // כאן אני מניח שברצונך להחזיר את הנתונים של כל מסמך
      console.log("111", this.tasks)
    } else {
      console.log('No tasks found for this coordinator');
    }
       this.loading = false;
  }

}
