import { Component } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { TaskDetails } from '../models/task-details.model';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { SupplierService } from '../services/supplier.service';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/email-service.service';
import { buildPluginData } from '../../app/shared/utils';
import { WizgroundService } from '../services/wizground.service';
import { initializeApp } from 'firebase/app';
import { FileUploadService } from '../services/upload.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-add-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentComponent implements OnInit {
  files: { [key: string]: File } = {};
  selectedFiles: { [type: string]: string } = {};
  tasks: TaskDetails[] | undefined;
  dragOverIndex: string | null = null;
  coordinators: any[] = [];
  selectedCoordinator: any = null;

  uploadSuccess = false;
  uploading = false;

  uploadedFilesStatus: {
    [type: string]: {
      status: 'success' | 'error';
      fileName: string;
      url?: string;
      errorMessage?: string;
    };
  } = {};



  fields = [
    { key: "accountKey", value: "12345" },
    { key: "documentid", value: "30" },
    { key: "fullname", value: "בוטן שקד" },
    { key: "remarks", value: "כץ שקד" },
    { key: "contactMail", value: "av********t.com" },
    { key: "Agent", value: "999" },
    { key: "Phone", value: "05****11" },
    { key: "Address1", value: "עפולה" },
    { key: "Address2", value: "ירושלים" },
    { key: "valueDate", value: "01/07/2023" },
    { key: "Reference", value: "3506" },
    { key: "itemkey", value: "12345" },
    { key: "Quantity", value: "1.000" },
    { key: "itemname", value: "בדיקה" },
    { key: "price", value: "0.000" }
  ];

  documents = [
    { type: 'bankApproval', label: 'אישור בנק/צילום שיק' },
    { type: 'bookkeepingApproval', label: 'אישור ניהול ספרים' },
    { type: 'taxApproval', label: 'אישור ניכוי מס במקור' },
    { type: 'contract', label: 'סכום ההתקשרות (חוזה חתום)', link: 'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhAHjojnUA_kA-MxKj1aOWdmrZKmhfJ3OhawZArvHuFfHMG3lBY5ZX3-WNkwbVQJKnc*' },
    { type: 'declaration', label: 'הצהרה', link: 'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDFGFGHjhjfjsdgsdfGZrXv5wT3O0hL6kdA-B1' } // ← כאן קישור אמיתי להצגת ההצהרה

  ];


  supplierData: any;

  constructor(
    private storage: Storage,
    private firestoreService: FirestoreService,
    private supplierService: SupplierService,
    private emailService: EmailService,
    private wizground: WizgroundService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {
    this.supplierData = this.supplierService.getSupplier();
  }
  async ngOnInit() {
    try {
      this.coordinators = await this.firestoreService.getAllCoordinators();
    } catch (error) {
      console.error("שגיאה בטעינת רשימת הרכזים:", error);
    }
  }

  goBack() {
    this.router.navigate(['/existProvider']);
  }


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
    if (!this.selectedCoordinator) {
      alert("יש לבחור רכז לפני שליחת הקבצים.");
      return;
    }


    this.uploading = true;

    try {
      const supplierData = this.supplierService.getSupplier();
      console.log("נתוני ספק:", supplierData);

      if (!supplierData) {
        console.error("שגיאה בלקיחת נתוני ספק");
        this.uploading = false;
        return;
      }

      const uploadPromises: Promise<void>[] = [];

      for (const type in this.files) {
        const file = this.files[type];
        if (!file) continue;

        const timestamp = new Date().getTime();

        // שמירת הקובץ בענן עם קבלת ה־URL האמיתי
        const uploadPromise = (async () => {
          try {
            const url = await this.uploadFileToCloud(file);

            this.uploadedFilesStatus[type] = {
              fileName: file.name,
              url: url,
              status: 'success'
            };

            // פתיחת משימה לרכז

            const task = {
              owner: supplierData.NameFromMarom,
              mailFromMarom: supplierData.mailFromMarom,
              description: `יש לאשר לספק ${supplierData.fullname} את הקובץ ${file.name}`,
              status: 1,
              title: "אישור קובץ",
              linkOfDoument: url,
              createdAt: new Date(),
              assignedCoordinator: {
                id: this.selectedCoordinator.id,
                name: this.selectedCoordinator.name,
                email: this.selectedCoordinator.email
              }
            };

            await this.firestoreService.addTask('tasks', task);

          } catch (err) {
            console.error("❌ שגיאה בהעלאת קובץ:", err);

            // עדכון הלוג עם שגיאה
            this.uploadedFilesStatus[type] = {
              fileName: file.name,
              status: 'error',
              errorMessage: (typeof err === 'object' && err !== null && 'message' in err)
                ? (err as { message: string }).message
                : 'שגיאה לא ידועה'
            };
          }
        })();


        uploadPromises.push(uploadPromise);
      }

      // מחכה שכל ההעלאות יסתיימו
      await Promise.all(uploadPromises);

      this.uploadSuccess = true;
      console.log("✅ העלאה הושלמה בהצלחה!");

    } catch (error) {
      console.error("❌ שגיאה בהעלאה:", error);
    } finally {
      this.uploading = false;
    }
  }


  // sendEmail(Email: string, description: String) {
  //   this.emailService.sendEmail('ayelethury@gmail.com', 'בדיקה', 'שלום עולם').subscribe();
  // }


  async uploadFileToCloud(file: File): Promise<string> {
    if (file) {
      try {
        const res = await firstValueFrom(
          this.fileUploadService.uploadFile(file)
        );
        console.log('✅ File uploaded', res);
        return res.url;
      } catch (err) {
        console.error('❌ Upload error', err);
        throw err;
      }
    } else {
      throw new Error('No file provided');
    }
  }
}

