import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  ngOnInit(): void {
    this.getMedicines;
  }


  registerMode = false;
  medicines: any;
  http = inject(HttpClient);

  registerToggle(){
    this.registerMode = !this.registerMode;
  }
  
  getMedicines(){
    this.http.get('https://localhost:7215/api/Medicines').subscribe({
      next: (response) => this.medicines = response,
      error: (error) => console.log(error),
      complete: () => console.log("Request completed")
    });
  }
}
