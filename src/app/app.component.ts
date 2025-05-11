import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupplierService } from './services/supplier.service';
import { HeaderComponent } from './headers/header.component';
//import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  providers: [SupplierService]
})

export class AppComponent {

  title = 'providers';
  //user$ = this.authService.getUser(); // מאזין לשינויים במשתמש

  constructor(private authService: AuthService) {}
  
}
