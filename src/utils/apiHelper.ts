import { APIRequestContext } from '@playwright/test';
import { Environment } from '@config/environment';
import logger from './logger';

export class ApiHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = Environment.apiBaseUrl;
  }

  async login(username: string, password: string): Promise<string> {
    logger.info(`API login attempt for user: ${username}`);
    const response = await this.request.post(`${this.baseUrl}/auth/login`, {
      data: { username, password },
    });
    const body = await response.json();
    logger.info(`API login response: ${response.status()}`);
    return body.data.token as string;
  }

  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers,
    });
    logger.info(`GET ${endpoint} -> ${response.status()}`);
    return response;
  }

  async post(endpoint: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      headers,
      data,
    });
    logger.info(`POST ${endpoint} -> ${response.status()}`);
    return response;
  }
}
