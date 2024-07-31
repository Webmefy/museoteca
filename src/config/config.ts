import dotenv from 'dotenv';
dotenv.config();

const storeName = `${process.env.SHOPIFY_STORE_NAME}`;
const apiVersion = '2024-07';

export const config = {
    NODE_ENV: `${process.env.NODE_ENV}`,
    PORT: process.env.PORT || 8080,
    SHOPIFY_STORE_NAME: storeName,
    SHOPIFY_ACCESS_TOKEN: `${process.env.SHOPIFY_ACCESS_TOKEN}`,
    SHOPIFY_SIGNING_SECRET: `${process.env.SHOPIFY_SIGNING_SECRET}`,
    SHOPIFY_URL_BASE: `https://${storeName}.myshopify.com/admin/api/${apiVersion}`,
    ftp_host: `${process.env.FTP_HOST}`,
    ftp_user: `${process.env.FTP_USER}`,
    ftp_password: `${process.env.FTP_PASSWORD}`,
};
