import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
    template: `
   <div class="login-container">
  <mat-card class="login-card">
    <mat-card-header>
      <mat-card-title>Criar nova conta</mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Nome completo</mat-label>
          <input matInput formControlName="name" placeholder="Seu nome">
          <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
          <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
            Mínimo 3 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="exemplo@email.com">
          <mat-icon matSuffix>email</mat-icon>
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
            Email é obrigatório
          </mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
            Email inválido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Senha</mat-label>
          <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
          <button type="button" mat-icon-button matSuffix (click)="togglePasswordVisibility()">
            <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
            Senha é obrigatória
          </mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
            Mínimo 6 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Confirmar Senha</mat-label>
          <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword">
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
            Confirmação é obrigatória
          </mat-error>
          <mat-error *ngIf="registerForm.errors?.['notSame']">
              As senhas não coincidem
          </mat-error>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          <mat-icon>error_outline</mat-icon>
          <span>{{errorMessage}}</span>
        </div>

        <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading" class="login-button">
          <span *ngIf="!isLoading">Registrar</span>
          <mat-spinner *ngIf="isLoading" diameter="24" color="accent"></mat-spinner>
        </button>
      </form>
    </mat-card-content>

    <mat-card-actions class="register-action">
      <span>Já tem uma conta?</span>
      <a routerLink="/login" mat-button color="primary">Faça login</a>
    </mat-card-actions>
  </mat-card>
</div>
  `,
styles: [`
  .login-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
  
  .login-card {
    width: 100%;
    max-width: 500px;
  }
  
  .error-message {
    color: #f44336;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 1rem 0;
  }
  
  .login-button {
    width: 100%;
    margin-top: 1rem;
  }
  
  .register-action {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
`]
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;
    
    this.authService.register(name, email, password)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.errorMessage = err.error.message || 'Erro ao registrar';
          console.error('Registration error:', err);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
