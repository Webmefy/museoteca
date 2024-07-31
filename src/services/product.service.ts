import { ProductFTP } from '../shared/interfaces/product-ftp.interface';
import fileService from './file.service';

class ProductService {
    private readonly filePath = '/files/products_ftp_example.txt';

    async findAllFTP(): Promise<ProductFTP[]> {
        const productsFtp = await fileService.processFile(this.filePath, 'products');
        return productsFtp as ProductFTP[];
    }
}

export default new ProductService();
