import { ShopifyOrderResponse } from '../../types/shopify';
import shopifyMapper from '../utils/shopify.mapper';
import fileService from './file.service';

class ShopifyService {
    processNewOrder(shopifyOrder: ShopifyOrderResponse) {
        try {
            const order = shopifyMapper.parseOrderToFTP(shopifyOrder);

            const pathDate = new Date().toLocaleDateString().replaceAll('/', '-');
            const pathNewOrders = `files/shopify_orders_${pathDate}.txt`;

            const orderFile = shopifyMapper.parseOrderToLinesFileFTP(order);
            fileService.writeFile(orderFile, pathNewOrders);
            // subir el archivo al ftp
        } catch (e) {}
    }
}

export default new ShopifyService();
