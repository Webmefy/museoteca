import { Client, FileInfo, FTPResponse } from 'basic-ftp';
import { logger } from '../middlewares/logger.middleware';
import { CredentialsFTP } from '../shared/interfaces/ftp.interface';

class FtpService {
    private client: Client;
    connected: boolean;

    constructor(credentials: CredentialsFTP) {
        this.client = new Client();
        this.client.ftp.verbose = true;
        this.connected = false;
        this.connect(credentials)
            .then((connection) => {
                logger.info(`Connection success with FTP ${JSON.stringify(connection)}`);
                this.connected = true;
            })
            .catch((e) => {
                logger.error(`Connection failed with FTP ${e}`);
                this.client.close();
            });
    }

    check(): boolean {
        return this.connected;
    }

    async waitConnection(): Promise<void> {
        let retries = 0;
        const maxRetries = 4;
        const retryDelay = 5000; // 5 seconds
        while (!this.check() && retries < maxRetries) {
            logger.info('Waiting for FTP connection...');
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            retries++;
        }
    }

    private async connect(credentials: CredentialsFTP): Promise<FTPResponse> {
        try {
            const connection = await this.client.access({
                host: credentials.host,
                user: credentials.user,
                password: credentials.password,
            });

            return connection;
        } catch (err) {
            const error = `Failed connection to FTP server ${err}`;
            logger.error(error);
            throw new Error(error);
        }
    }

    async list(path: string = ''): Promise<FileInfo[]> {
        try {
            const list = await this.client.list(path);
            logger.info(`Directory ${path} items list: ${JSON.stringify(list)}`);
            return list;
        } catch (e) {
            const error = `Failed list with FTP ${e}`;
            logger.error(error);
            throw error;
        }
    }

    async uploadFile(pathOrigin: string, pathDestination: string): Promise<FTPResponse> {
        try {
            const response = await this.client.uploadFrom(pathOrigin, pathDestination);
            logger.info(`File uploaded successfully ${JSON.stringify(response)}`);
            return response;
        } catch (e) {
            const error = `Failed uploading file ${e}`;
            logger.error(error);
            throw error;
        }
    }

    async downloadFile(pathDestination: string, pathRemote: string): Promise<FTPResponse> {
        try {
            const response = await this.client.downloadTo(pathDestination, pathRemote);
            logger.info(`File downloading successfully ${JSON.stringify(response)}`);
            return response;
        } catch (e) {
            const error = `Failed downloading file ${e}`;
            logger.error(error);
            throw error;
        }
    }

    disconnect() {
        try {
            this.client.close();
            logger.info('Connection was closed');
        } catch (e) {
            const error = `Failed disconnecting FTP`;
            logger.error(error);
            throw error;
        }
    }
}

export default FtpService;
