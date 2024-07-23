import * as fs from 'node:fs';

enum TypeOfLine {
    'O' = 'O', // linea de pedido
    'C' = 'C', // linea de datos de contacto y envio
    'P' = 'P', // linea de producto
}

enum ShippingStatus {}
    // 1- Museo	a	cliente
    // 2- Museo	a	cliente
    // 3- Recogida	en	tienda
    // 4- Envío	desde	Museoteca	a	cliente
    // 5-Envío	desde	Museoteca	a	Museo	y	de	Museo a	cliente
    // 6-Envío	desde	Museoteca	a	cliente
    // 7-Envío	desde	Museoteca	a	Museo	y	de	Museo a	cliente
    // 8- Recogida	en	tienda	con	producto	Museoteca

interface Order {
    typeOfLine: TypeOfLine.O;
    id: string;
    totalPrice: number; // decimal
    createdAt: string; // YYYYMMDD
    contact: Contact;
    products: Product[];
}

interface Shipping {
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

interface Contact extends Shipping {
    typeOfLine: TypeOfLine.C;
    orderId: string;
    firstName: string;
    lastName: string;
    telephone: string;
    email: string;
}

interface Product {
    typeOfLine: TypeOfLine;
    orderId: string;
    imageId: string;
    imageTitle: string;
    imageAuthor: string;
    optionId: string;
    quantity: number;
    price: number; // decimal
}

async function getOrderFile() {
    try {
    } catch (e) {
    } finally {
    }
}

function readOrderFile(): Order[] {
    const data = fs.readFileSync('./files/orders_ftp_example.txt');
    const splitList: string[] = data.toString().split('\r\n');
    const orders: Order[] = [];
    for (let i = 0; i < splitList.length; i++) {
        const lineParsed = splitList[i].split('|');

        if (lineParsed[0] === TypeOfLine.O) {
            const orderId = lineParsed[1];
            const contactLine = splitList.find((concatLine) =>
                concatLine.startsWith(`${TypeOfLine.C}|${orderId}`),
            );
            if (!contactLine) {
                throw new Error(`Customer don't found in order ${orderId}`);
            }
            const contactInfo = contactLine.split('|');
            const contact: Contact = {
                typeOfLine: TypeOfLine.C,
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

            const products: Product[] = splitList
                .filter((productLine) => productLine.startsWith(`${TypeOfLine.P}|${orderId}`))
                .map((productLine) => {
                    const plParsed = productLine.split('|');
                    return {
                        typeOfLine: plParsed[0],
                        orderId,
                        imageId: plParsed[2],
                        imageTitle: plParsed[3],
                        imageAuthor: plParsed[4],
                        optionId: plParsed[5],
                        quantity: parseInt(plParsed[6]),
                        price: parseFloat(plParsed[7]),
                    } as Product;
                });

            const order: Order = {
                typeOfLine: lineParsed[0],
                id: orderId,
                totalPrice: parseFloat(lineParsed[2]),
                createdAt: lineParsed[3],
                contact,
                products,
            };
            orders.push(order);
        }
    }
    return orders;
}

async function processUpdateOrders() {
    await getOrderFile();
    const fileOrders = readOrderFile();
    // update shopify
}

function newOrders() {}

function saveOrdersFile() {}

async function processRegisterOrders() {}
