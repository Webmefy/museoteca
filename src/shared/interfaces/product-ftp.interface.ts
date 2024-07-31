import { FinisherIdentifiersFTP, SizesFTP, SupportsFTP, TypeOfLineFTP } from "../enums/museoteca.enum";

export interface ProductFTP {
    typeOfLine: TypeOfLineFTP.P; // O product option, P product
    imageId: string;
    title: string; // Product option don't have title
    author: string;
    available: number; // 0 not available , 1 available
    options: ProductOptionFTP[];
}


export interface ProductOptionFTP {
    typeOfLine: TypeOfLineFTP.O; // O product option, P product
    imageId: string;
    title: null;
    optionId: string;
    supportId: SupportsFTP;
    sizeId: SizesFTP;
    finisherId: FinisherIdentifiersFTP;
    imageHeight: number; // (mm)
    imageMargin: number; // 8 -> 8%
    imageWidth: number; // (mm)
    imageFrame: number; // mm
    price: number; // decimal
    available: number; // 0 not available , 1 available
}