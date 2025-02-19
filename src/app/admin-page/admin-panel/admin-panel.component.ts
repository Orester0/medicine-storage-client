import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule,
    MatTabsModule,
    MatDialogModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }


}
