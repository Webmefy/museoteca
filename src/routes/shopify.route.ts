import { Router } from 'express';
import shopifyController from '../controllers/shyopify.controller';

const shopify = Router();

shopify.post('/webhook/order/create', shopifyController.handleNewOrder);

export default shopify;
