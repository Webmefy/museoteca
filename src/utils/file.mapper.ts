import {
    FinisherIdentifiersFTP,
    SizesFTP,
    SupportsFTP,
    TypeOfLineFTP,
} from '../shared/enums/museoteca.enum';
import { ContactFTP, OrderFTP, ProductItemFTP } from '../shared/interfaces/order-ftp.interface';
import { ProductFTP, ProductOptionFTP } from '../shared/interfaces/product-ftp.interface';

class FileMapper {
    parseProductsFileFTP(productFile: string[]): ProductFTP[] {
        const products: ProductFTP[] = [];
        const optionsMap: { [key: string]: ProductOptionFTP[] } = {};

        for (const line of productFile) {
            const lineParsed = line.split('|');

            if (lineParsed[0] === TypeOfLineFTP.O) {
                const imageId = lineParsed[1];
                if (!optionsMap[imageId]) {
                    optionsMap[imageId] = [];
                }
                const supportId = SupportsFTP[lineParsed[4] as keyof typeof SupportsFTP];
                const sizeId = SizesFTP[lineParsed[5] as keyof typeof SizesFTP];
                const finisherId =
                    FinisherIdentifiersFTP[lineParsed[6] as keyof typeof FinisherIdentifiersFTP];
                const option: ProductOptionFTP = {
                    typeOfLine: lineParsed[0],
                    imageId,
                    title: null,
                    optionId: lineParsed[3],
                    supportId,
                    sizeId,
                    finisherId,
                    imageHeight: parseInt(lineParsed[7]),
                    imageMargin: parseInt(lineParsed[8]),
                    imageWidth: parseInt(lineParsed[9]),
                    imageFrame: parseInt(lineParsed[10]),
                    price: parseFloat(lineParsed[11]),
                    available: parseInt(lineParsed[12]),
                };
                optionsMap[imageId].push(option);
            }
        }

        for (const line of productFile) {
            const lineParsed = line.split('|');

            if (lineParsed[0] === TypeOfLineFTP.P) {
                const imageId = lineParsed[1];
                const options = optionsMap[imageId] || [];
                const product: ProductFTP = {
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

        return products;
    }

    private parseContactFileFTP(contactLine: string, orderId: string): ContactFTP {
        const contactInfo = contactLine.split('|');
        return {
            typeOfLine: TypeOfLineFTP.C,
            orderId,
            firstName: contactInfo[2],
            lastName: contactInfo[3],
            telephone: contactInfo[4],
            email: contactInfo[5],
            receivedFirstName: contactInfo[6],
            receivedLastName: contactInfo[7],
            country: contactInfo[8],
            state: contactInfo[9],
            city: contactInfo[10],
            postalCode: contactInfo[11],
            address: contactInfo[12],
            shippingMethod: parseInt(contactInfo[13]),
        };
    }

    private parseProductItemFileFTP(productLine: string, orderId: string): ProductItemFTP {
        const plParsed = productLine.split('|');
        return {
            typeOfLine: plParsed[0] as TypeOfLineFTP.P,
            orderId,
            imageId: plParsed[2],
            imageTitle: plParsed[3],
            imageAuthor: plParsed[4],
            optionId: plParsed[5],
            quantity: parseInt(plParsed[6]),
            price: parseFloat(plParsed[7]),
        };
    }

    parseOrdersFileFTP(orderFile: string[]): OrderFTP[] {
        const orders: OrderFTP[] = [];
        orderFile.forEach((line) => {
            const lineParsed = line.split('|');

            if (lineParsed[0] === TypeOfLineFTP.O) {
                const orderId = lineParsed[1];
                const contactLine = orderFile.find((contactLine) =>
                    contactLine.startsWith(`${TypeOfLineFTP.C}|${orderId}`),
                );

                if (!contactLine) {
                    throw new Error(`Customer not found in order ${orderId}`);
                }

                const contact = this.parseContactFileFTP(contactLine, orderId);
                const products = orderFile
                    .filter((productLine) =>
                        productLine.startsWith(`${TypeOfLineFTP.P}|${orderId}`),
                    )
                    .map((productLine) => this.parseProductItemFileFTP(productLine, orderId));

                const order: OrderFTP = {
                    typeOfLine: lineParsed[0],
                    id: orderId,
                    totalPrice: Number.parseFloat(lineParsed[2]),
                    createdAt: lineParsed[3],
                    contact,
                    products,
                };

                orders.push(order);
            }
        });

        return orders;
    }
}

export default new FileMapper();
