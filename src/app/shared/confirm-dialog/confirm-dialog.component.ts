// shared/confirm-dialog/confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Interface para tipagem dos dados
interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  warn?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container" [class.warn-dialog]="data.warn">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
        <p class="warning-message">
          <mat-icon>warning</mat-icon>
          <span>Esta ação não pode ser desfeita!</span>
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-raised-button 
          [color]="data.warn ? 'warn' : 'primary'" 
          [mat-dialog-close]="true" 
          cdkFocusInitial>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
      max-width: 400px;
    }
    .warn-dialog {
      border-top: 4px solid #f44336;
    }
    .warning-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      margin: 16px 0 0;
      padding: 8px;
      background: #ffebee;
      border-radius: 4px;
    }
    mat-dialog-actions {
      padding: 16px 0 0;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}