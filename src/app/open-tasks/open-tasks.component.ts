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
   previewFile: any = null;

  constructor(private firestoreService: FirestoreService) {}

  async loadTasks() {
     if (!this.coordinatorId) return;

     this.loading = true;
     const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId' ,this.coordinatorId);
     const data = await this.firestoreService.getDocumentsByParameter('tasks', 'owner', this.coordinatorId);
     if (data) {
      // ממיר את הנתונים לפורמט מתאים
      this.tasks  = data;
    } else {
      console.log('No tasks found for this coordinator');
    }
       this.loading = false;
  }

  toDate(timestamp: any): Date {
  return timestamp?.toDate ? timestamp.toDate() : timestamp;
}

  openPreview(file: any) {
    this.previewFile = file;
  }

  closePreview() {
    this.previewFile = null;
  }

  approve(file: any) {
    console.log('מאושר:', file);
    this.closePreview();
    // פה תוכל לשלוח עדכון לשרת
  }

  reject(file: any) {
    console.log('לא מאושר:', file);
    this.closePreview();
    // פה תוכל לשלוח עדכון לDB
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }

  isPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  isWordOrOther(url: string): boolean {
    return /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url);
  }
}
