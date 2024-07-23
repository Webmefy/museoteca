import * as fs from 'node:fs';

enum TypeOfLine {
    'Option' = 'O',
    'Product' = 'P',
}

enum Supports {
    LI = 'LI',
    EM = 'EM',
}

enum Sizes {
    B4 = 'B4', // XS (25 cm	lado largo de la imagen)
    B3 = 'B3', // S	(40	cm lado largo de la imagen)
    B2 = 'B2', // M	(50	cm lado largo de la imagen)
    B1 = 'B1', // L	(70	cm lado largo de la imagen)
    B0 = 'B0', // XL (80 cm lado largo de la imagen)
    BA = 'BA', // XXL (95 cm lado largo de la imagen)
}

enum FinisherIdentifiers {
    FL = 'FL', // 'sin	marco'
    LB = 'LB', // 'bastidor'
    MA = 'MA', // 'Madera	natural	(papel)'
    MB = 'MB', // 'Madera	Wengué	(papel)'
    MC = 'MC', // 'Madera	negra	(papel)'
    MD = 'MD', // 'Madera	natural	(lienzo)'
    ME = 'ME', // 'Madera	Wengué	(lienzo)'
    MF = 'MF', // 'Madera	negra	(lienzo)'
}

interface Product {
    typeOfLine: TypeOfLine.Product; // O product option, P product
    imageId: string;
    title: string; // Product option don't have title
    author: string;
    available: number; // 0 not available , 1 available
    options: ProductOption[];
}

interface ProductOption {
    typeOfLine: TypeOfLine.Option; // O product option, P product
    imageId: string;
    title: null;
    optionId: string;
    supportId: Supports;
    sizeId: Sizes;
    finisherId: FinisherIdentifiers;
    imageHeight: number; // (mm)
    imageMargin: number; // 8 -> 8%
    imageWidth: number; // (mm)
    imageFrame: number; // mm
    price: number; // decimal
    available: number; // 0 not available , 1 available
}

const data = fs.readFileSync('./files/products_ftp_example.txt');
const splitList: string[] = data.toString().split('\r\n');
const products: Product[] = [];
for (let i = 0; i < splitList.length; i++) {
    const lineParsed = splitList[i].split('|');

    if (lineParsed[0] === TypeOfLine.Product) {
        const imageId = lineParsed[1];
        let options: ProductOption[] = splitList
            .filter((optionLine) => optionLine.startsWith(`${TypeOfLine.Option}|${imageId}`))
            .map((optionLine) => {
                const lParsed = optionLine.split('|');
                const supportId = Supports[lParsed[4] as Supports];
                const sizeId = Sizes[lParsed[5] as Sizes];
                const finisherId = FinisherIdentifiers[lParsed[6] as FinisherIdentifiers];
                return {
                    typeOfLine: lParsed[0],
                    imageId: lParsed[1],
                    title: lParsed[2] || null,
                    optionId: lParsed[3],
                    supportId,
                    sizeId,
                    finisherId,
                    imageHeight: parseInt(lParsed[7]),
                    imageMargin: parseInt(lParsed[8]),
                    imageWidth: parseInt(lParsed[9]),
                    imageFrame: parseInt(lParsed[10]),
                    price: parseFloat(lParsed[11]),
                    available: parseInt(lParsed[12]),
                } as ProductOption;
            });
        const product: Product = {
            typeOfLine: lineParsed[0],
            imageId,
            title: lineParsed[2],
            author: lineParsed[3],
            available: parseInt(lineParsed[6]),
            options,
        };
        products.push(product);
    }
}

console.log('products ', products.length);
// 	O|01401||EMB3MD|EM|B3|MD|304|400|8|20|103.00|1|

const productO1: ProductOption = {
    typeOfLine: TypeOfLine.Option,
    imageId: '01401',
    title: null,
    optionId: 'EMB3MD',
    supportId: Supports.EM,
    sizeId: Sizes.B3,
    finisherId: FinisherIdentifiers.MD,
    imageHeight: 304, // (mm)
    imageWidth: 400, // (mm)
    imageMargin: 8, // 8 -> 8%
    imageFrame: 20, // mm
    price: 103.0, // decimal
    available: 1,
};

//	O|01401||LIB3MC|LI|B3|MC|304|400|0|20|108.00|1|

const productO2: ProductOption = {
    typeOfLine: TypeOfLine.Option,
    imageId: '01401',
    title: null,
    optionId: 'LIB3MC',
    supportId: Supports.LI,
    sizeId: Sizes.B3,
    finisherId: FinisherIdentifiers.MC,
    imageHeight: 304, // (mm)
    imageWidth: 400, // (mm)
    imageMargin: 0, // 0 -> 0%
    imageFrame: 20, // mm
    price: 108.0, // decimal
    available: 1,
};

function calcTotalMargin(margin: number, width: number): number {
    const totalMargin = margin / 100;
    return width * totalMargin * 2;
}

function calcHeightTotalSize(product: ProductOption): number {
    const marginSize = calcTotalMargin(product.imageMargin, product.imageWidth);
    return product.imageHeight + marginSize + product.imageFrame;
}

function calcWidthTotalSize(product: ProductOption): number {
    const marginSize = calcTotalMargin(product.imageMargin, product.imageWidth);
    return product.imageWidth + marginSize + product.imageFrame;
}
