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
    // ניסיון ראשון לקבלת state מהניווט הנוכחי
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.providerData = navigation.extras.state['providerData'];
    } else {
      // אם לא נמצא state מהניווט (למשל בדף רענן) – לקבל את state מה-history
      this.providerData = history.state.providerData;
    }
    console.log("Provider Data:", this.providerData);
    this.name = this.providerData!['name'];
    this.id = this.providerData!['supplierId'];
  }
  

    addDocumentsForProvider() {
      this.router.navigate(['/addDocuments']);
    }

    editProvider() {
      this.inputId!.value = this.id;
      this.showAddNewForm = true;
    }
  }
