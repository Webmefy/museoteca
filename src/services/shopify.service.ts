import { ShopifyOrderResponse } from '../../types/shopify';
import { logger } from '../middlewares/logger.middleware';
import shopifyMapper from '../utils/shopify.mapper';
import fileService from './file.service';

class ShopifyService {
    processNewOrder(shopifyOrder: ShopifyOrderResponse) {
        try {
            logger.info(`Shopify new order ${shopifyOrder.id}`);
            const order = shopifyMapper.parseOrderToFTP(shopifyOrder);

            const pathDate = new Date().toLocaleDateString().replaceAll('/', '-');
            const pathNewOrders = `files/shopify_orders_${pathDate}.txt`;

            const orderFile = shopifyMapper.parseOrderToLinesFileFTP(order);
            fileService.writeFile(orderFile, pathNewOrders);

            // subir el archivo al ftp
        } catch (e) {
            const error = `Failed processing order ${shopifyOrder.id}`;
            logger.error(error);
            throw new Error(error);
        }
    }
}

export default new ShopifyService();
