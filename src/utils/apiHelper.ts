import { APIRequestContext } from '@playwright/test';
import { Environment } from '@config/environment';
import logger from './logger';

export class ApiHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginSubmit(username: string, password: string) {
    logger.info(`API login attempt for user: ${username}`);
    const response = await this.request.post(`${Environment.baseUrl}/web/index.php/auth/validate`, {
      data: { username, password },
    });
    logger.info(`API login response: ${response.status()}`);
    return response;
  }
}
