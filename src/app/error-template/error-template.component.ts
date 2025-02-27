import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-template',
  imports: [CommonModule],
  templateUrl: './error-template.component.html',
  styleUrl: './error-template.component.css'
})
export class ErrorTemplateComponent implements OnInit{
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  @Input() title = 'Error';
  @Input() message = 'An error occurred.';
  @Input() details: string | null = null;

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
