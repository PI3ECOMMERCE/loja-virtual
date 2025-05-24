import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://vitrine-68en.onrender.com/api'; // URL da API

  
  private authStatus = new BehaviorSubject<boolean>(this.checkInitialAuthState());

  constructor(private http: HttpClient, private router: Router) {}

  // Verifica se já existe token ao carregar o serviço
  private checkInitialAuthState(): boolean {
    return !!localStorage.getItem('token');
  }

  // Corrija o método login para usar a URL correta
login(email: string, password: string) {
  return this.http.post<{ idToken: string }>(`${this.apiUrl}/login`, { 
    email, 
    password 
  }).pipe(
    tap({
      next: (response) => {
        localStorage.setItem('token', response.idToken); // Note a mudança para idToken
        this.authStatus.next(true);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert(err.error?.message || 'Login falhou!'); // Mensagem mais descritiva
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
 
  

  register(name: string, email: string, password: string) {
  return this.http.post(`${this.apiUrl}/register`, { 
    name, 
    email, 
    password 
  }).pipe(
    tap((response: any) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.authStatus.next(true);
      }
    })
  );
}

}