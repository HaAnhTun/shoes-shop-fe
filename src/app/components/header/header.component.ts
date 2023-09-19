import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router) {}
  items = [
    {
      label: 'Home',
      command: () => {
        // Navigate to the HomeComponent
        this.router.navigate(['/home']);
      },
    },
    {
      label: 'Shop',
      command: () => {
        // Navigate to the ShopComponent
        this.router.navigate(['/shop']);
      },
    },
    {
      label: 'Manage',
      command: () => {
        // Navigate to the ManageComponent
        this.router.navigate(['/manage']);
      },
    },
  ];
}
