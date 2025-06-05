import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CoordinatorComponent } from './coordinator/coordinator.component';
import { ManagerComponent } from './manager/manager.component';
import { AddDocumentComponent } from './add-documents/add-documents.component'
import { ExistProviderComponent } from './exist-provider/exist-provider.component'

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'coordinator', component: CoordinatorComponent },
  { path: 'manager', component: ManagerComponent },
  { path: 'WelcomeComponent', component: WelcomeComponent },
  { path: 'addDocuments', component: AddDocumentComponent },
  { path: 'existProvider', component: ExistProviderComponent},
  { path: '', redirectTo: '/MailSenderComponent', pathMatch: 'full' },



];

