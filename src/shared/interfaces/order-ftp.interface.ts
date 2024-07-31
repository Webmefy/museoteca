import { TypeOfLineFTP } from '../enums/ftp.enum';

export interface OrderFTP {
    typeOfLine: TypeOfLineFTP.O;
    id: string;
    totalPrice: number; // decimal
    createdAt: string; // YYYYMMDD
    contact: ContactFTP;
    products: ProductItemFTP[];
}

export interface ShippingFTP {
    receivedFirstName: string;
    receivedLastName: string;
    country: string; // Codigo ISO del Pais
    state: string;
    city: string;
    postalCode: string;
    address: string;
    // TODO: revisar!
    shippingMethod: number; // from 1 to 8
}

export interface ContactFTP extends ShippingFTP {
    typeOfLine: TypeOfLineFTP.C;
    orderId: string;
    firstName: string;
    lastName: string;
    telephone: string;
    email: string;
}

export interface ProductItemFTP {
    typeOfLine: TypeOfLineFTP;
    orderId: string;
    imageId: string;
    imageTitle: string;
    imageAuthor: string;
    optionId: string;
    quantity: number;
    price: number; // decimal
}
