export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string; 
  link: string; 
  createdAt?: Date;
  updatedAt?: Date;
}
