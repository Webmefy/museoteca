import * as fs from 'node:fs';
import { logger } from '../middlewares/logger.middleware';
import { FileMapper } from '../shared/interfaces/file.interface';
import { OrderFTP } from '../shared/interfaces/order-ftp.interface';
import { ProductFTP } from '../shared/interfaces/product-ftp.interface';
import fileMapper from '../utils/file.mapper';

class FileService {
    writeFile(lines: string[], filePath: string): void {
        const content = lines.join('\n') + '\n';
        
        fs.appendFile(filePath, content, 'utf8', (err) => {
            if (err) {
                logger.error('Error writing to file:', err);
            } else {
                logger.info('Line written to file successfully.');
            }
        });
    }

    parsedFile(path: string): string[] {
        const file = fs.readFileSync(path);
        const fileParsed: string[] = file.toString().split('\r\n');

        return fileParsed;
    }

    async processFile(
        path: string,
        type: 'products' | 'orders',
    ): Promise<ProductFTP[] | OrderFTP[]> {
        const file = this.parsedFile(path);

        const mapperFile: FileMapper = {
            products: () => fileMapper.parseProductsFileFTP(file),
            orders: () => fileMapper.parseOrdersFileFTP(file),
        };

        return mapperFile[type](file);
    }
}

export default new FileService();
