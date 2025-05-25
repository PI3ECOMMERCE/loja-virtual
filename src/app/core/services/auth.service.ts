import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vitrine-68en.onrender.com/api';
  private authStatus = new BehaviorSubject<boolean>(this.checkInitialAuthState());

  constructor(private http: HttpClient, private router: Router) { }

  private checkInitialAuthState(): boolean {
    return !!localStorage.getItem('token');
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap({
        next: (response) => {
          console.log('Resposta completa do login:', response);
          if (response.success) {
            const token = response.idToken || response.customToken;
            if (!token) {
              throw new Error('Token não recebido na resposta');
            }
            localStorage.setItem('token', token);
            this.authStatus.next(true);
          } else {
            throw new Error(response.message || 'Login falhou');
          }
        },
        error: (err) => {
          console.error('Erro completo na autenticação:', {
            status: err.status,
            message: err.message,
            error: err.error,
            url: err.url
          });

          throw this.parseAuthError(err);
        }
      })
    );
  }

  private parseAuthError(err: any): any {
    if (err.status === 401) {
      if (err.error?.error === 'auth/wrong-password') {
        return { ...err, message: 'Senha incorreta' };
      } else if (err.error?.error === 'auth/user-not-found') {
        return { ...err, message: 'Usuário não encontrado' };
      } else {
        return { ...err, message: 'Credenciais inválidas' };
      }
    }
    return err;
  }

  register(name: string, email: string, password: string) {
    return this.http.post<{
      success: boolean;
      uid?: string;
      idToken?: string;
      message?: string
    }>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            if (response.idToken) {
              localStorage.setItem('token', response.idToken);
              this.authStatus.next(true);
              this.router.navigate(['/admin']);
            } else {
              alert(response.message || 'Registro concluído! Faça login.');
              this.router.navigate(['/login']);
            }
          }
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert(err.error?.message || 'Erro durante o registro');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authStatus.value;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }
}