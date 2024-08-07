export interface ShopifyProduct {
  product: {
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    tags: string;
    variants: [
      {
        option1: string;
        price: string;
        sku: string;
      }
    ];
  };
}
