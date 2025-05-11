import { Component } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { TaskDetails } from '../models/task-details.model';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { SupplierService } from '../services/supplier.service';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/email-service.service';

@Component({
  selector: 'app-add-documents',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './add-documents.component.html',
  styleUrls: [ './add-documents.component.css']
})
export class AddDocumentComponent {
   files: { [key: string]: File } = {};
   selectedFiles: { [type: string]: string } = {};
   tasks: TaskDetails[] | undefined;
   dragOverIndex: string | null = null;

   uploadSuccess = false;
   uploading = false;

  documents = [
    { type: 'bankApproval', label: 'אישור בנק/צילום שיק' },
    { type: 'bookkeepingApproval', label: 'אישור ניהול ספרים' },
    { type: 'taxApproval', label: 'אישור ניכוי מס במקור' },
    { type: 'contract', label: 'סכום ההתקשרות (חוזה חתום)' }
  ];


  constructor(private storage: Storage, private firestoreService: FirestoreService ,
     private supplierService: SupplierService, 
      private emailService: EmailService) { }


onDragOver(event: DragEvent, type: string) {
  event.preventDefault();
  this.dragOverIndex = type;
}

onDragLeave(event: DragEvent) {
  this.dragOverIndex = null;
}

onDrop(event: DragEvent, type: string) {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file) {
    this.selectedFiles[type] = file.name;
    // this.uploadFile(file, type);
  }
  this.dragOverIndex = null;
} 

  onFileSelected(event: any, type: string) {

    if (event.target.files.length > 0) {
      this.files[type] = event.target.files[0];
      this.selectedFiles[type] = this.files[type].name;
    }
   }

   isFormValid() {
     return true;
   }

   async uploadFiles() {
    console.log("מתחיל העלאה...");
  
    this.uploading = true;
    
    try {
      const supplierData = this.supplierService.getSupplier();
      console.log("נתוני ספק:", supplierData);
  
      if (!supplierData) {
        console.error("שגיאה בלקיחת נתוני ספק");
        this.uploading = false;
        return;
      }
  
      const uploadPromises = [];
  
      for (const type in this.files) {
        const file = this.files[type];
        if (!file) continue;
  
        const timestamp = new Date().getTime();
        const filePath = `documents/${type}_${timestamp}_${file.name}`;
  
        // TODO: שמירת הקובץ בפועל - צריך להוסיף כאן קריאה ל firestoreService / storage
        //uploadPromises.push(this.firestoreService.uploadFile(filePath, file));
  
        const task = {
          owner: supplierData.NameFromMarom,
          mailFromMarom: supplierData.mailFromMarom,
          description: `יש לאשר לספק ${supplierData.name} את הקובץ ${file.name}`,
          status: 1,
          title: "אישור קובץ",
          linkOfDoument: "link", // כאן צריך להכניס את הלינק האמיתי אחרי העלאה
          createdAt: new Date()
        };
  
        this.firestoreService.addTask('tasks', task);
        
        // TODO: שליחת מייל אחרי שמירת משימה
       // this.sendEmail(task.mailFromMarom, task.description );
      }
  
      //await Promise.all(uploadPromises);
  
      this.uploadSuccess = true;
      console.log("העלאה הושלמה בהצלחה!");
  
    } catch (error) {
      console.error("שגיאה בהעלאה:", error);
    } finally {
      this.uploading = false;
    }
  }

  sendEmail(Email: string, description: String )
  {
    this.emailService.sendEmail('ayelethury@gmail.com', 'בדיקה', 'שלום עולם').subscribe();
  }

  saveFileData(type: string, url: string) {
    console.log( "&&&&&&&&&" ,type, url);
  //   this.firestoreService.saveDocuments()
  //   this.firestore.collection('supplierDocuments').add({
  //     type,
  //     url,
  //     timestamp: new Date()
  //   });
   }
}
