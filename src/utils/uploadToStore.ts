import axios, { AxiosError } from 'axios';
import * as path from 'path';
import { Product } from '../shared/interfaces/product-xlsx';
import { ShopifyProduct } from '../shared/interfaces/shopifyProduct';
import { readXlsxFile } from '../tools/readXlsxFiles';
import { config } from '../config/config';
import * as dotenv from 'dotenv';

dotenv.config();

const mapToShopifyFormat = (product: Product): ShopifyProduct => {
  return {
    product: {
      title: product.title,
      body_html: `<strong>${product.title}</strong> by ${product.author}`,
      vendor: config.SHOPIFY_STORE_NAME,
      product_type: "Museoteca",
      tags: "",
      variants: [
        {
          option1: "Default Title",
          price: "0.00",
          sku: product.imageId
        }
      ]
    }
  };
};

async function uploadProductsToShopify(products: Product[]) {
  const shopifyUrl = `https://${config.SHOPIFY_STORE_NAME}.myshopify.com`;
  const accessToken = config.SHOPIFY_ACCESS_TOKEN;

  const mappedProducts = products.map(mapToShopifyFormat);

  for (const product of mappedProducts) {
    try {
      const response = await axios.post(
        `${shopifyUrl}/admin/api/2023-07/products.json`,
        product,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`Producto creado: ${response.data.product.title}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error al crear producto:', axiosError.response.data);
      } else {
        console.error('Error al crear producto:', axiosError.message);
      }
    }
  }
}

const filePath = path.resolve(__dirname, '../../products.xlsx');
const products: Product[] = readXlsxFile(filePath);

uploadProductsToShopify(products)
  .then(() => console.log('Todos los productos fueron subidos'))
  .catch(error => console.error('Error subiendo productos:', error));
