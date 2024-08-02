import { Fulfillment } from '../../../types/shopify';

export interface FindOrdersFulfillmentResponseGraphQLDto {
    nodes: Array<{
        id: string;
        fulfillmentOrders: {
            nodes: [
                {
                    id: string;
                    status: string;
                },
            ];
        };
    }>;
    errors: ErrorDtoGraphQL;
}

export interface UpdateOrderFulfillmentRequestDto {
    fulfillment: {
        line_items_by_fulfillment_order: [
            {
                fulfillment_order_id: string;
            },
        ];
    };
}

export interface UpdateOrderFulfillmentResponseDto {
    fulfillment: Fulfillment;
    errors?: string[];
}

export type ErrorDtoGraphQL = Array<{
    message: string;
    locations: Array<{
        line: number;
        column: number;
    }>;
    path: Array<string>;
}>;

export type GraphQLRequest = {
    query: string;
    variables?: any;
};

export type GraphQLResponse<T> = { data: T };
