// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('http://localhost:3000/api/login', { email, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.authStatus.next(true);
          this.router.navigate(['/admin']);
        },
        error: () => alert('Login falhou!')
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }
}