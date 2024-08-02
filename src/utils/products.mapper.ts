import { ProductOptionFTP } from "../shared/interfaces/product-ftp.interface";

class ProductMapper {
    calcTotalMargin(margin: number, width: number): number {
        const totalMargin = margin / 100;
        return width * totalMargin * 2;
    }

    calcHeightTotalSize(product: ProductOptionFTP): number {
        const marginSize = this.calcTotalMargin(product.imageMargin, product.imageWidth);
        return product.imageHeight + marginSize + product.imageFrame;
    }

    calcWidthTotalSize(product: ProductOptionFTP): number {
        const marginSize = this.calcTotalMargin(product.imageMargin, product.imageWidth);
        return product.imageWidth + marginSize + product.imageFrame;
    }
}

export default new ProductMapper();
