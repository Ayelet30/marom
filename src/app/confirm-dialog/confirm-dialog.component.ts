import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 חובה בשביל *ngIf, *ngFor וכו'

@Component({
  selector: 'app-confirm-dialog',
  standalone: true, // 👈 חובה כדי שנוכל לייבא את הקומפוננטה הזו בקומפוננטות אחרות
  imports: [CommonModule], // 👈 הוספה של CommonModule
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() title: string = 'אישור פעולה';
  @Input() message: string = 'האם אתה בטוח?';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
