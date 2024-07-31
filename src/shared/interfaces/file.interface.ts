import { OrderFTP } from "./order-ftp.interface";
import { ProductFTP } from "./product-ftp.interface";

export type FileType = 'products' | 'orders';

export interface FileMapper {
    products: (file: string[]) => ProductFTP[];
    orders: (file: string[]) => OrderFTP[];
}