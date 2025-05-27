import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputData } from '../models/input-data.model';

@Component({
    selector: 'app-custom-input',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.css']
})
export class CustomInputComponent {
  @Input() data!: InputData;
  @Input() options: { id: string; name: string }[] = [];
  @Input() control!: FormControl; 
  @Input() isEditMode: boolean = false;

  @ViewChild('inputRef') inputRef!: NgModel;  


  get isControlReady(): boolean {
    return !!this.control; // מחזיר true רק אם ה-control מאותחל
  }
}
