import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-open-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule,ConfirmDialogComponent],
  templateUrl: './open-tasks.component.html',
  styleUrls: ['./open-tasks.component.css']
})
export class OpenTasksComponent {
  coordinatorId = '';
  tasks: any[] = [];
  loading = false;
  previewFile: any = null;
  showConfirm = false;
  taskToApprove: any;

  constructor(private firestoreService: FirestoreService) { }
  hasLoadedOnce = false;

  async loadTasks() {
  if (!this.coordinatorId) return;

  this.loading = true;
  this.hasLoadedOnce = false;

  try {
    const coordinatorData = await this.firestoreService.getDocumentByParameter('coordinators', 'coordinatorId', this.coordinatorId);
    const data = await this.firestoreService.getDocumentsByParameter('tasks', 'owner', this.coordinatorId);

    if (data) {
      // סינון משימות לפי סטטוס 1 או 2 בלבד
      this.tasks = data
        .filter(task => task.status === 1 || task.status === 2)
        .map(task => {
          if (task.status === 2) {
            return {
              ...task,
              title: 'לא מאושר' // שינוי הכותרת במצב של סטטוס 2
            };
          }
          return task;
        });
    } else {
      this.tasks = [];
      console.log('No tasks found for this coordinator');
    }
  } catch (error) {
    console.error("שגיאה בטעינת משימות:", error);
    this.tasks = [];
  } finally {
    this.loading = false;
    this.hasLoadedOnce = true;
  }
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

   approve(task: any) {
    this.taskToApprove = task;
    this.showConfirm = true;
  }
 async onConfirmApprove() {
        this.closePreview(); // 👈 תוספת חשובה כדי להעלים את תצוגת הקובץ
    const task = this.taskToApprove;
    this.showConfirm = false;

    try {
      await this.firestoreService.updateDocument('tasks', task.id, { status: 3 });
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.closePreview();
    } catch (error) {
      console.error("שגיאה באישור המשימה:", error);
    }

  }

  onCancelApprove() {
    this.showConfirm = false;
    this.taskToApprove = null;
      this.closePreview(); // 👈 תוספת חשובה כדי להעלים את תצוגת הקובץ

  }


 async reject(task: any) {
  try {
    await this.firestoreService.updateDocument('tasks', task.id, { status: 2 });

    // טוען מחדש כדי שהכותרת תשתנה ל"לא מאושר"
    await this.loadTasks();

    this.closePreview();
  } catch (error) {
    console.error("שגיאה בדחיית המשימה:", error);
  }
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
