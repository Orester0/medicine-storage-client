import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorTemplateComponent } from '../error-template/error-template.component';

@Component({
  selector: 'app-internal-server-error',
  standalone: true,
  imports: [ErrorTemplateComponent],
  templateUrl: './internal-server-error.component.html',
  styleUrl: './internal-server-error.component.css'
})
export class InternalServerErrorComponent {
  error: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }
}