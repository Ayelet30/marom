import { Component } from '@angular/core';
import { EmailService } from '../services/email-service.service';
import { FormsModule } from '@angular/forms';
import { read, utils } from 'xlsx';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { InputData } from '../models/input-data.model';

@Component({
  selector: 'app-mail-sender',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './mail-sender.component.html',
 styleUrls: ['./mail-sender.component.css']
})
export class MailSenderComponent {

  to = '';
  subject = '';
  text = '';
  html = '';
  pdfFile: File | null = null; // Made public to allow usage in other methods
  excelFile: File | null = null;
  excelData: any[] = [];
  fileUrl: string = '';
  path: string = 'C:/Users/user1/MoachSites/';

  inputSelectExelModel: InputData = {
    id: 'SelectExel',
    label: 'בחר קובץ XL',
    value: '',
    type: 'file',
    name: "SelectExel",
    error: ''
  };

  inputSubjectModel: InputData = {
    id: 'Subject',
    label: 'נושא: ',
    value: '',
    type: 'text',
    name:"Subject",
    error: ''
  };

  inputTextModel: InputData = {
    id: 'text',
    label: 'תוכן: ',
    value: '',
    type: 'text',
    name:"text",
    error: ''
  };

  inputSelectFileModel: InputData = {
    id: 'SelectFile',
    label: ' בחר קישור לקובץ PDF לשליחה',
    value: '',
    type: 'file',
    name:"SelectFile",
    error: ''
  };

  constructor(
    private emailService: EmailService
  ) { }

  onFileUpload(event: any, type: 'pdf' | 'excel') {
    const file = event.target.files[0];
    if (type === 'pdf') {
      this.pdfFile = file;
    } else if (type === 'excel') {
      this.excelFile = file;
      this.loadExcelData(file);
    }
  }

  async loadExcelData(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });

      const tableStartIndex = rows.findIndex(row =>
        row.includes('שם פרטי') && row.includes('EMail') && row.includes('שם משפחה')
      );

      if (tableStartIndex === -1) {
        console.error('לא נמצאה טבלה עם כותרות "שם פרטי", "שם משפחה", ו-"EMail"');
        return;
      }

      const headerRow = rows[tableStartIndex];
      const nameColumnIndex = headerRow.indexOf('שם פרטי');
      const familyNameColumnIndex = headerRow.indexOf('שם משפחה');
      const IDColumnIndex = headerRow.indexOf('מספר זהות')
      const classColumnIndex = headerRow.indexOf('מחלקה');
      const emailColumnIndex = headerRow.indexOf('EMail');
      const phonNumberColumnIndex = headerRow.indexOf('טלפון');
      const dateofChangeColumnIndex = headerRow.indexOf('תאריך סיום');

      if (nameColumnIndex === -1 || familyNameColumnIndex === -1 || emailColumnIndex === -1 || IDColumnIndex === -1 || classColumnIndex === -1 || phonNumberColumnIndex === -1 || dateofChangeColumnIndex === -1) {
        console.error('לא נמצאו עמודות "שם פרטי", "שם משפחה", ו-"EMail"');
        return;
      }

      this.excelData = rows.slice(tableStartIndex + 1).map(row => ({
        name: row[nameColumnIndex] || '',
        email: row[emailColumnIndex] || '',
        family: row[familyNameColumnIndex] || '',
        ID: row[IDColumnIndex] || '',
        class: row[classColumnIndex] || '',
        phonNumber: row[phonNumberColumnIndex] || '',
        dateofChange: row[dateofChangeColumnIndex] || '',
      }));
    };

    reader.onerror = (error) => {
      console.error('שגיאה בטעינת קובץ האקסל:', error);
    };

    reader.readAsArrayBuffer(file);
  }

  async createPersonalDocAndFillDetails(row: any) {
    if (!this.pdfFile) {
      console.error('PDF file not loaded');
      return;
    }

    try {
      // טען את קובץ ה-PDF
      const pdfBytes = await this.pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // רשום את fontkit
      pdfDoc.registerFontkit(fontkit);

      // טען את הגופן מהמיקום בתיקיית assets
      const fontBytes = await fetch('assets/fonts/Rubik-Regular.ttf').then((res) =>
        res.arrayBuffer()
      );

      // הטמע את הגופן בתוך ה-PDF
      const customFont = await pdfDoc.embedFont(fontBytes);

      // קבל את הדף הראשון
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // כתוב טקסט עם הגופן המותאם אישית
      firstPage.drawText(`${row.family || ''} ${row.name || ''}`, {
        x: 350,
        y: 628,
        size: 12,
        font: customFont,
      });

      firstPage.drawText(`${row.ID || ''}`, {
        x: 160,
        y: 628,
        size: 12,
        font: customFont,
      });

      firstPage.drawText(`${row.class || ''}`, {
        x: 235,
        y: 603,
        size: 12,
        font: customFont,
      });

      firstPage.drawText(`${row.phonNumber || ''}`, {
        x: 235,
        y: 578,
        size: 12,
        font: customFont,
      });

      firstPage.drawText(`${row.dateofChange || ''}`, {
        x: 225,
        y: 300,
        size: 12,
        font: customFont,
      });

      // שמור את ה-PDF עם השינויים
      const modifiedPdfBytes = await pdfDoc.save();

      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

      const tempFile = new File([blob], `${row.email}.pdf`, { type: 'application/pdf' });

      this.sendEmail(row.email, tempFile);
    }
    catch (error) {
      console.error('Error creating or modifying PDF:', error);
    }

  }

  downloadFile(data: Uint8Array, filename: string) {
    const blob = new Blob([data], { type: 'application/pdf' }); // יצירת Blob מסוג PDF
    const link = document.createElement('a'); // יצירת אלמנט קישור זמני
    link.href = window.URL.createObjectURL(blob); // יצירת כתובת URL זמנית עבור ה-Blob
    link.download = filename; // שם הקובץ שיורד
    link.click(); // לחיצה על הקישור להורדה
    window.URL.revokeObjectURL(link.href); // שחרור הזיכרון של ה-URL הזמני
  }


  async prepareAndSendEmails() {
    if (!this.pdfFile || this.excelData.length === 0) {
      alert('Please upload both PDF and Excel files!');
      return;
    }

    for (const row of this.excelData) {
      if (!row.email || !row.name || !row.family || !row.ID || !row.class || !row.phonNumber || !row.dateofChange) {
        console.warn('Skipping row due to missing data:', row);
        continue;
      }
      await this.createPersonalDocAndFillDetails(row);
      // if(this.fileToSend){
        //this.sendEmail(row.email, this.fileToSend);
      // }
    }
  }


  sendEmail(to: string, pdfFile: File) {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', this.subject);
    formData.append('text', this.text);
    formData.append('pdfFile', pdfFile);

    this.emailService.sendEmail(to, this.subject, this.text).subscribe({
      next: () => alert('המייל נשלח בהצלחה!'),
      error: () => alert('שליחת המייל נכשלה.'),
    });
  }

}
