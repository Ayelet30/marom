import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  constructor(private router: Router) { }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

}


