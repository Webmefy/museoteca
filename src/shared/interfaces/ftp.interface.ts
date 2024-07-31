import { Order } from "./order-ftp.interface";
import { Product } from "./product-ftp.interface";

export type FileType = 'products' | 'orders';

export interface FileMapper {
    products: (file: string[]) => Product[];
    orders: (file: string[]) => Order[];
}