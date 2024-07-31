import { OrderFTP } from '../shared/interfaces/order-ftp.interface';
import fileService from './file.service';

class OrderService {
    private readonly filePath = '/files/orders_ftp_example.txt'

    async findAllFTP(): Promise<OrderFTP[]> {
        const ordersFtp = await fileService.processFile(this.filePath, 'orders');
        return ordersFtp as OrderFTP[];
    }
}

export default new OrderService();
