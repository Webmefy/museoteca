import { Customer, LineItem2, ShippingAddress, ShopifyOrderResponse } from '../../types/shopify';
import { TypeOfLineFTP } from '../shared/enums/museoteca.enum';
import {
    ContactFTP,
    OrderFTP,
    ProductItemFTP,
    ShippingFTP,
} from '../shared/interfaces/order-ftp.interface';

class ShopifyMapper {
    parseCustomerToFTP(
        orderId: string,
        customerShopify: Customer,
        shippingShopify: ShippingAddress,
    ): ContactFTP {
        const shipping: ShippingFTP = {
            address: `${shippingShopify.address1} ${shippingShopify.address2 ?? ''}`,
            city: shippingShopify.city,
            country: shippingShopify.country_code,
            postalCode: shippingShopify.zip,
            receivedFirstName: shippingShopify.first_name,
            receivedLastName: shippingShopify.last_name,
            state: shippingShopify.province,
            shippingMethod: 1, // TODO: definir logica de envio
        };

        const contact: ContactFTP = {
            typeOfLine: TypeOfLineFTP.C,
            firstName: customerShopify.first_name,
            lastName: customerShopify.last_name,
            telephone: customerShopify.phone,
            email: customerShopify.email,
            orderId,
            ...shipping,
        };

        return contact;
    }

    parseProductItemToFTP(orderId: string, productsShopify: LineItem2[]): ProductItemFTP[] {
        return productsShopify.map((item) => {
            // TODO: revisar
            const productItemFTP: ProductItemFTP = {
                typeOfLine: TypeOfLineFTP.P,
                imageAuthor: '',
                imageId: '',
                imageTitle: item.name,
                optionId: item.sku,
                price: Number.parseFloat(item.price),
                quantity: item.quantity,
                orderId,
            };
            return productItemFTP;
        });
    }

    parseOrderToFTP(orderShopify: ShopifyOrderResponse): OrderFTP {
        const contact = this.parseCustomerToFTP(
            orderShopify.id.toString(),
            orderShopify.customer,
            orderShopify.shipping_address,
        );
        const products: ProductItemFTP[] = this.parseProductItemToFTP(
            orderShopify.id.toString(),
            orderShopify.line_items,
        );

        return {
            typeOfLine: TypeOfLineFTP.O,
            id: orderShopify.id.toString(),
            totalPrice: Number.parseInt(orderShopify.total_price),
            createdAt: orderShopify.created_at,
            contact,
            products,
        };
    }

    parseOrderToLinesFileFTP(order: OrderFTP): string[] {
        const orderLine = `${order.typeOfLine}|${order.id}|${order.totalPrice}|${order.createdAt
            .split('T')[0]
            .replaceAll('-', '')}`;

        const contact = order.contact;
        const contactLine = `${contact.typeOfLine}|${contact.orderId}|${contact.firstName}|${
            contact.lastName
        }|${contact.telephone ?? ' '}|${contact.email}|${contact.receivedFirstName}|${
            contact.receivedLastName
        }|${contact.country}|${contact.state}|${contact.city}|${contact.postalCode}|${
            contact.address
        }|${contact.shippingMethod}`;

        const productLines = order.products.map((product) => {
            return `${product.typeOfLine}|${product.orderId}|${product.imageId}|${product.imageTitle}|${product.imageAuthor}|${product.optionId}|${product.quantity}|${product.price}`;
        });

        return [orderLine, contactLine, ...productLines];
    }
}

export default new ShopifyMapper();
