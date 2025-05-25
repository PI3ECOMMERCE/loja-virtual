import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../../core/models/product.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule],
  template: `
  
    <div class="container">
      <div class="header">
        <h2>Gerenciar Produtos</h2>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> Novo Produto
        </button>
      </div>

      <div class="table-container">
        <mat-spinner *ngIf="loading" diameter="50"></mat-spinner>

        <!-- Async pipe -->
      <table mat-table [dataSource]="dataSource" *ngIf="!loading">
          <!-- Coluna Nome -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let product">{{ product.name }}</td>
          </ng-container>

          <!-- Coluna Preço -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Preço</th>
            <td mat-cell *matCellDef="let product">{{ product.price | currency:'BRL':'symbol':'1.2-2' }}</td>
          </ng-container>

          <!-- Coluna Ações -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let product">
              <button mat-icon-button color="primary" [routerLink]="['edit', product.id]">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" 
                (click)="deleteProduct(product.id, product.name)"
                matTooltip="Excluir permanentemente"
                aria-label="Excluir">
                <mat-icon>delete_forever</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .table-container {
      position: relative;
      min-height: 200px;
    }
    mat-spinner {
      margin: 50px auto;
    }
    table {
      width: 100%;
    }
    mat-icon {
      font-size: 20px;
    }
  `]
})
export class ProductListComponent {
  displayedColumns = ['name', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  loading = true;

  // Injeção de dependências
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

 constructor() {
    this.initializeProducts();
  }

  private initializeProducts() {
    this.productService.getProducts().pipe(
      tap(products => {
        this.dataSource.data = products;
        this.loading = false;
      }),
      catchError(err => {
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.loading = false;
        return of([]);
      })
    ).subscribe();
  }

  async deleteProduct(id: string, productName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o produto "${productName}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        warn: true
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    
    if (result) {
      try {
        await this.productService.deleteProduct(id);
        this.snackBar.open(`"${productName}" excluído permanentemente!`, 'Fechar', { 
          duration: 3000,
          panelClass: ['success-snackbar'] 
        });
      } catch (error) {
        this.snackBar.open(`Falha ao excluir "${productName}"`, 'Fechar', { 
          duration: 3000,
          panelClass: ['error-snackbar'] 
        });
        console.error(error);
      }
    }
  }
}
