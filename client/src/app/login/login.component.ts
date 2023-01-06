import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    // Here is where you would make an HTTP request to the backend API.
    // The API URL and any necessary headers are typically configured
    // in a separate service.
    const body = {
      emailAddress: this.email,
      password: this.password
    };
    this.http.post('/api/account/login', body).subscribe(response => {
      this.router.navigate(['/user-homepage']);
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  goToSignup() {
    this.router.navigate(['/create-account']);
  }
}
