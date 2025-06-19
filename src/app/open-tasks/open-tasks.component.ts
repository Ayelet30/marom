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

  constructor(private firestoreService: FirestoreService) { }
  hasLoadedOnce = false;

  async loadTasks() {
    if (!this.coordinatorId) return;

    this.loading = true;
    this.hasLoadedOnce = false; // מוודא שזה יוסתר בכל התחלה של טעינה
    try {
      const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId', this.coordinatorId);
      const data = await this.firestoreService.getDocumentsByParameter('tasks', 'owner', this.coordinatorId);
      if (data) {
        // ממיר את הנתונים לפורמט מתאים
        this.tasks = data;
      } else {
        this.tasks = []; // מבטיח שהמשתנה יהיה ריק כדי שהתנאי בתבנית יעבוד

        console.log('No tasks found for this coordinator');
      }
    }
    catch (error) {
      console.error("שגיאה בטעינת משימות:", error);
      this.tasks = []; // כדי שלא תיתקע במקרה של שגיאה
    } finally {
      this.loading = false;
      this.hasLoadedOnce = true; // מציין שסיימנו נסיון טעינה
    }
  }

  toDate(timestamp: any): Date {
    return timestamp?.toDate ? timestamp.toDate() : timestamp;
  }

  openPreview(file: any) {
    this.previewFile = file;
    console.log('the id is :', file?.id);

  }

  closePreview() {
    this.previewFile = null;
  }

  async approve(file: any) {
    console.log('מאושר:', file);
    await this.firestoreService.updateDocument('tasks', file.id, { status: 3 });
    this.closePreview();
  }


  async reject(file: any) {
    console.log('לא מאושר:', file);
    await this.firestoreService.updateDocument('tasks', file.id, { status: 2 });
    this.closePreview();
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
  sortDirection: 'asc' | 'desc' = 'asc';

  sortByDate() {
    this.tasks.sort((a, b) => {
      const dateA = (a.createdAt?.toDate?.() || new Date()).getTime();
      const dateB = (b.createdAt?.toDate?.() || new Date()).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }


}
