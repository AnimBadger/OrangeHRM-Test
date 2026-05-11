import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import type { UserCredentials } from '@types/index';

dotenvConfig({ path: path.resolve(__dirname, '../../env/.env') });

export class Environment {
  static get baseUrl(): string {
    return process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
  }

  static get apiBaseUrl(): string {
    return (
      process.env.API_BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2'
    );
  }

  static get timeout(): number {
    return Number(process.env.TIMEOUT) || 30000;
  }

  static get retries(): number {
    return Number(process.env.RETRIES) || 1;
  }

  static get headless(): boolean {
    return process.env.HEADLESS !== 'false';
  }

  static get adminCredentials(): UserCredentials {
    return {
      username: process.env.ADMIN_USERNAME || 'Admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    };
  }
}
