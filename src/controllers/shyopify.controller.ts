import { Request, Response } from "express";
import { config } from "../config/config";
import { logger } from "../middlewares/logger.middleware";
import cryptoService from "../services/crypto.service";
import shopifyService from "../services/shopify.service";

class ShopifyController {
    handleNewOrder(req: Request, res: Response): void {
        try {
            const hmac = req.get('X-Shopify-Hmac-Sha256') as string;
            const hmacVerified = cryptoService.verifyHmac(
                req.rawBody,
                `${config.SHOPIFY_SIGNING_SECRET}`,
                hmac,
            );
            if (!hmacVerified) {
                res.status(401).send('Unauthorized');
            }

            shopifyService.processNewOrder(req.body);
        } catch (e) {
            logger.info('Error in handle new order ', e);
            res.status(400).send(JSON.stringify(e));
        } finally   {
            res.status(200).send('OK');
        }
    }
}

export default new ShopifyController();
