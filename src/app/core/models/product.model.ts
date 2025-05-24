// product.model.ts
export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string;  // Adicione
  link: string;   // Adicione
  createdAt?: Date;
  updatedAt?: Date;
}