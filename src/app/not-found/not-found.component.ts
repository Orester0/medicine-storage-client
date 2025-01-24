import { Component } from '@angular/core';
import { ErrorTemplateComponent } from '../error-template/error-template.component';

@Component({
  selector: 'app-not-found',
  imports: [ErrorTemplateComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
