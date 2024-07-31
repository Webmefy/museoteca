import { Client } from 'basic-ftp';
import { logger } from '../middlewares/logger.middleware';
import { CredentialsFTP } from '../shared/interfaces/ftp.interface';

class FtpService {
    async connect(ftpCredentials: CredentialsFTP) {
        const client = new Client();
        client.ftp.verbose = true;

        try {
            await client.access({
                host: ftpCredentials.host,
                user: ftpCredentials.user,
                password: ftpCredentials.password,
            });

            logger.info('Connected to the FTP server');

            // List files in the root directory
            const list = await client.list();
            logger.info('Directory listing:');
            logger.info(list);

            // // Upload a file
            // await client.uploadFrom('path/to/local/file.txt', 'remote/file.txt');
            // logger.info('File uploaded successfully');

            // // Download a file
            // await client.downloadTo('path/to/local/downloaded_file.txt', 'remote/file.txt');
            // logger.info('File downloaded successfully');
        } catch (err) {
            const error = `Failed connection to FTP server ${err}`;
            logger.error(error);
            throw new Error(error);
        } finally {
            client.close();
            logger.info('Connection with FTP server closed');
        }
    }

    uploadFile(): boolean {
        return true;
    }
}

export default new FtpService();
