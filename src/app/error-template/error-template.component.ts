import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-template',
  imports: [CommonModule],
  templateUrl: './error-template.component.html',
  styleUrl: './error-template.component.css'
})
export class ErrorTemplateComponent implements OnInit{
  @Input() title = 'Error';
  @Input() message = 'An error occurred.';
  @Input() details: string | null = null;

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = this.route.snapshot.data['title'] || this.title;
    this.message = this.route.snapshot.data['message'] || this.message;

    this.route.queryParams.subscribe(params => {
      this.title = params['title'] || this.title;
      this.message = params['message'] || this.message;
      this.details = params['details'] || null;
    });
  }

  goBack() {
    this.location.back();
  }
}
