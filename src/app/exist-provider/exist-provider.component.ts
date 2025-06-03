import { Component, Input, OnInit } from '@angular/core';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { NewProviderComponent } from "../provider-details/provider-details.component";
import { InputData } from '../models/input-data.model';

@Component({
  selector: 'app-exist-provider',
  standalone: true,
  imports: [CommonModule, NewProviderComponent, RouterModule],
  templateUrl: './exist-provider.component.html',
  styleUrls: ['./exist-provider.component.css']
})
export class ExistProviderComponent {
  public static lastProviderData: DocumentData | undefined = undefined;
  constructor(private firestoreService: FirestoreService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {
  }

  inputId: InputData = {
    id: 'licenseNumber',
    label: 'מספר עוסק מורשה',
    value: '',
    type: 'number',
    name: "licenseNumber",
    error: "יש להכניס 9 ספרות",
    maxlength: '9'
  };

  branchNumber: InputData = {
    id: 'branchNumber',
    label: 'מס סניף',
    value: '',
    type: 'number',
    name: "branchNumber",
    error: "יש להכניס 3 ספרות",
    maxlength: '3'
  };

  providerData: DocumentData | undefined;
  name: string = "";
  id: string = "";

  showAddNewForm:boolean = false;

 ngOnInit(): void {
  const navigation = this.router.getCurrentNavigation();

  if (navigation?.extras.state?.['providerData']) {
    this.providerData = navigation.extras.state['providerData'];
  } else if (history.state?.['providerData']) {
    this.providerData = history.state['providerData'];
  } else if (ExistProviderComponent.lastProviderData) {
    this.providerData = ExistProviderComponent.lastProviderData;
  } else {
    console.warn("לא התקבלו נתוני ספק — נשאר בדף ריק");
    return;
  }

  // שמירה לזיכרון סטטי
  ExistProviderComponent.lastProviderData = this.providerData;

  // ✅ תנאי לפני גישה למידע כדי למנוע שגיאת 'possibly undefined'
  if (this.providerData) {
    this.name = this.providerData['fullName'];
    this.id = this.providerData['taxFileNum'];
  }
}

  

    addDocumentsForProvider() {
      this.router.navigate(['/addDocuments']);
    }

    editProvider() {
      this.inputId!.value = this.id;
      this.showAddNewForm = true;
    }
  }
