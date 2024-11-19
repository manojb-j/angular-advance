declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:
        '455498460458-ngqnau9d6eqr2jf917afh92f7gh1aal3.apps.googleusercontent.com',
      callback: (resp: any) => {
        console.log(resp);
        this.handleLogin(resp);
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 250,
    });
  }
  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleLogin(responce: any) {
    if (responce) {
      const payload = this.decodeToken(responce.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payload));
      this.authStateService.setUser(payload);
      console.log('logged in user name payload', payload);
      this.router.navigate(['blogsList']);
    }
  }
  login = {
    email: '',
    password: '',
  };

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  onLogin() {
    const { email, password } = this.login;
    this.authService.getUserDetails(email, password).subscribe({
      next: (responce) => {
        if (responce.length >= 1) {
          const user = responce[0];
          const userName = user.fullName;
          console.log('logged in user name', userName);
          sessionStorage.setItem(
            'loggedInUser',
            JSON.stringify({ name: userName })
          );
          this.authStateService.setUser({ name: userName });
          this.router.navigate(['blogsList']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'someting went wrong',
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'someting went wrong',
        });
      },
    });
  }
}
