import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit{
  signInFormValue:any ={};
  user_data:any;
  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginSignupService) {
  }
  ngOnInit(): void {
    this.signInFormValue = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(5)]]
    });

  }
  onSubmitSignIn(): void {
    if (this.signInFormValue.valid) {
      this.loginService.adminLogin(this.signInFormValue.value.userEmail, this.signInFormValue.value.userPassword)
        .subscribe(data => {
          this.user_data = data;
          if (this.user_data.length === 1) {
            sessionStorage.setItem("user_session_id", this.user_data[0].id);
            sessionStorage.setItem("role", this.user_data[0].role);
            this.router.navigateByUrl('/admin-dashboard');
          } else {
            alert("Invalid Response");
          }
        }, error => {
          console.log("Error: ", error);
        });
    }
  }


}
