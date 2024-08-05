import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ShopifyOrderResponse } from '../../types/shopify';
import { config } from '../config/config';
import { axios } from '../middlewares/axios.middleware';
import { logger } from '../middlewares/logger.middleware';
import {
    FindOrdersFulfillmentResponseGraphQLDto,
    GraphQLRequest,
    GraphQLResponse,
    UpdateOrderFulfillmentRequestDto,
    UpdateOrderFulfillmentResponseDto,
} from '../shared/dtos/order-fulfillment.dto';
import { CredentialsFTP } from '../shared/interfaces/ftp.interface';
import { OrderFTP } from '../shared/interfaces/order-ftp.interface';
import { extractIdGraphQL, fileDate } from '../utils/helper';
import shopifyMapper from '../utils/shopify.mapper';
import fileService from './file.service';
import FtpService from './ftp.service';

class ShopifyService {
    private readonly credentials: CredentialsFTP;
    constructor() {
        this.credentials = {
            host: config.ftp_host,
            user: config.ftp_user,
            password: config.ftp_password,
        };
    }

    async processNewOrder(shopifyOrder: ShopifyOrderResponse) {
        try {
            logger.info(`Shopify new order ${shopifyOrder.id}`);
            const order = shopifyMapper.parseOrderToFTP(shopifyOrder);

            const fileName = `shopify_orders_${fileDate()}.txt`;
            const pathNewOrders = `files/${fileName}`;

            const orderFile = shopifyMapper.parseOrderToLinesFileFTP(order);
            fileService.writeFile(orderFile, pathNewOrders);
        } catch (e) {
            const error = `Failed processing order ${shopifyOrder.id}`;
            logger.error(error);
            throw new Error(error);
        }
    }

    async processFulfillOrders() {
        const ordersFTP = await this.findFtpOrders();

        const ordersIds = shopifyMapper.parseOrderFtpToGraphQLIds(ordersFTP);

        const fulfillmentOrders = await this.findFulFillmentOrders(ordersIds);

        let promises = 10;
        let updateOrdersFulfillmentPromises: Promise<
            AxiosResponse<UpdateOrderFulfillmentResponseDto>
        >[] = [];
        let promisesResultOrdersFulfillment: PromiseSettledResult<
            AxiosResponse<UpdateOrderFulfillmentResponseDto>
        >[] = [];
        for (const node of fulfillmentOrders.nodes) {
            const orderGid = node.fulfillmentOrders.nodes[0].id;
            const orderIdLegacy = extractIdGraphQL(orderGid);

            updateOrdersFulfillmentPromises.push(this.updateOrderFulFillment(orderIdLegacy));
            if (updateOrdersFulfillmentPromises.length === promises) {
                promisesResultOrdersFulfillment = promisesResultOrdersFulfillment.concat(
                    await Promise.allSettled(updateOrdersFulfillmentPromises),
                );
            }
        }
        if (updateOrdersFulfillmentPromises.length) {
            promisesResultOrdersFulfillment = promisesResultOrdersFulfillment.concat(
                await Promise.allSettled(updateOrdersFulfillmentPromises),
            );
        }

        promisesResultOrdersFulfillment.forEach((result) => {
            if (result.status === 'fulfilled') {
                const value = result.value;
                const fulfillment = result.value.data.fulfillment;
                logger.info(
                    `Promise for fulfillment order id ${fulfillment.order_id} fulfilled: status ${
                        value.status
                    } data ${JSON.stringify(fulfillment)} -  reqId: ${value.config.reqId}`,
                );
            } else if (result.status === 'rejected') {
                const config = result.reason.content.config;
                const response = result.reason.content.response;
                const orderFulfillmentId = JSON.parse(config.data).fulfillment
                    .line_items_by_fulfillment_order[0].fulfillment_order_id;
                logger.error(
                    `Promise for fulfillment order id ${orderFulfillmentId} rejected: status ${
                        response.status
                    } data ${JSON.stringify(response.data)} - reqId: ${config.reqId}`,
                );
            }
        });
    }

    async processUploadOrders(file?: string) {
        const fileName = file ? file : `shopify_orders_${fileDate()}.txt`;
        try {
            const localPath = `files/${fileName}`;

            logger.info(`Uploading shopify orders from ${fileName} to FTP`);

            const ftpService = new FtpService(this.credentials);
            await ftpService.waitConnection();
            ftpService.uploadFile(localPath, `orders/${fileName}`).finally(() => {
                ftpService.disconnect();
            });
        } catch (e) {
            const error = `Failed uploading orders from ${fileName} to FTP`;
            logger.error(error);
            throw new Error(error);
        }
    }

    private async findFtpOrders(): Promise<OrderFTP[]> {
        try {
            const ftpService = new FtpService(this.credentials);
            await ftpService.waitConnection();
            const list = await ftpService.list('orders');
            const item = list.reduce((oldest, current) => {
                return new Date(current.rawModifiedAt) < new Date(oldest.rawModifiedAt)
                    ? current
                    : oldest;
            });
            await ftpService
                .downloadFile(`files/${item.name}`, `orders/${item.name}`)
                .finally(() => {
                    ftpService.disconnect();
                });

            return (await fileService.processFile(`files/${item.name}`, 'orders')) as OrderFTP[];
        } catch (e) {
            const error = `Failed finding ftp orders in orders ${e}}`;
            logger.error(error);
            throw new Error(error);
        }
    }

    private async findFulFillmentOrders(
        orderIds: string[],
    ): Promise<FindOrdersFulfillmentResponseGraphQLDto> {
        const url = `${config.SHOPIFY_URL_BASE}/graphql.json`;
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                'X-Shopify-Access-Token': config.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': `application/json`,
            },
        };

        const query: string = `query getOrders($ids: [ID!]!) {
                        nodes(ids: $ids) {
                            ... on Order {
                            id
                            fulfillmentOrders(first: 2) {
                                nodes {
                                id
                                status
                            }
                        }
                    }
                }
            }
        `;

        const payload: GraphQLRequest = {
            query: query,
            variables: {
                ids: orderIds,
            },
        };
        try {
            const response: AxiosResponse<
                GraphQLResponse<FindOrdersFulfillmentResponseGraphQLDto>
            > = await axios.post(url, payload, axiosConfig);
            if (response.data.data.errors) {
                throw new Error(JSON.stringify(response.data.data.errors));
            }
            return response.data.data;
        } catch (e) {
            logger.error(
                `Failed request finding fulfillment of orders in ${JSON.stringify(
                    orderIds,
                )} error: ${e}`,
            );
            throw e;
        }
    }

    private async updateOrderFulFillment(
        orderId: string,
    ): Promise<AxiosResponse<UpdateOrderFulfillmentResponseDto>> {
        const url = `${config.SHOPIFY_URL_BASE}/fulfillments.json`;
        const axiosConfig: AxiosRequestConfig = {
            headers: {
                'X-Shopify-Access-Token': config.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': `application/json`,
            },
        };

        const payload: UpdateOrderFulfillmentRequestDto = {
            fulfillment: {
                line_items_by_fulfillment_order: [
                    {
                        fulfillment_order_id: orderId,
                    },
                ],
            },
        };
        try {
            const response: AxiosResponse<UpdateOrderFulfillmentResponseDto> = await axios.post(
                url,
                payload,
                axiosConfig,
            );
            if (response.data.errors) {
                throw new Error(JSON.stringify(response.data.errors));
            }
            return response;
        } catch (e) {
            logger.error(`Failed request update fulfillment of order ${orderId} error: ${e}`);
            throw e;
        }
    }
}

export default new ShopifyService();
