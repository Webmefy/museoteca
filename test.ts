import { config } from './src/config/config';
import ftpService from './src/services/ftp.service';
import { CredentialsFTP } from './src/shared/interfaces/ftp.interface';

async function testFtpService() {
    const credentials: CredentialsFTP = {
        user: config.ftp_user,
        password: config.ftp_password,
        host: config.ftp_host,
    };
    await ftpService.connect(credentials);
}

testFtpService();
