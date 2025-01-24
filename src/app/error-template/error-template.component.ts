import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-error-template',
  imports: [CommonModule],
  templateUrl: './error-template.component.html',
  styleUrl: './error-template.component.css'
})
export class ErrorTemplateComponent {
  @Input() title = 'Error';
  @Input() message = 'An error occurred.';
  @Input() details: string | null = null;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
