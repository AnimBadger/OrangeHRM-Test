import { APIRequestContext, APIResponse } from '@playwright/test';
import { Environment } from '@config/environment';
import { API_ROUTES } from '@data/constants';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  CreateJobTitleRequest,
  UpdateJobTitleRequest,
} from '@typedefs/index';
import logger from './logger';

export class ApiHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private url(path: string): string {
    return `${Environment.baseUrl}${path}`;
  }

  /** Extract the CSRF token from the Vue SPA login page */
  private async extractToken(): Promise<string> {
    const loginPage = await this.request.get(this.url('/web/index.php/auth/login'));
    const html = await loginPage.text();
    const match = html.match(/:token="&quot;([^&]+)&quot;/);
    if (!match) {
      throw new Error('Could not extract CSRF token from login page');
    }
    return match[1];
  }

  async loginSubmit(username: string, password: string): Promise<APIResponse> {
    logger.info(`API login attempt for user: ${username}`);
    const token = await this.extractToken();
    const response = await this.request.post(this.url('/web/index.php/auth/validate'), {
      form: { _token: token, username, password },
      maxRedirects: 0,
    });
    logger.info(`API login response: ${response.status()} ${response.url()}`);
    return response;
  }

  /** Login and follow all redirects to establish a full session for API calls */
  async loginAndFollowRedirect(username: string, password: string): Promise<APIResponse> {
    logger.info(`API login (with redirect follow) for user: ${username}`);
    const token = await this.extractToken();
    const response = await this.request.post(this.url('/web/index.php/auth/validate'), {
      form: { _token: token, username, password },
      maxRedirects: 5,
    });
    logger.info(`API login final: ${response.status()} ${response.url()}`);
    return response;
  }

  async getUsers(): Promise<APIResponse> {
    logger.info('Fetching admin users');
    const response = await this.request.get(this.url(API_ROUTES.adminUsers));
    logger.info(`GET users response: ${response.status()}`);
    return response;
  }

  async createUser(data: CreateUserRequest): Promise<APIResponse> {
    logger.info(`Creating user: ${data.username} (roleId: ${data.userRoleId})`);
    const response = await this.request.post(this.url(API_ROUTES.adminUsers), {
      data,
    });
    logger.info(`POST create user response: ${response.status()}`);
    return response;
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<APIResponse> {
    logger.info(`Updating user ${id}: ${data.username} (roleId: ${data.userRoleId})`);
    const response = await this.request.put(`${this.url(API_ROUTES.adminUsers)}/${id}`, {
      data,
    });
    logger.info(`PUT update user response: ${response.status()}`);
    return response;
  }

  async deleteUsers(ids: number[]): Promise<APIResponse> {
    logger.info(`Deleting users: [${ids.join(', ')}]`);
    const response = await this.request.delete(this.url(API_ROUTES.adminUsers), {
      data: { ids },
    });
    logger.info(`DELETE users response: ${response.status()}`);
    return response;
  }

  async validateUsername(username: string): Promise<APIResponse> {
    logger.info(`Validating username: ${username}`);
    const response = await this.request.get(
      `${this.url(API_ROUTES.adminUsersValidate)}?userName=${username}`,
    );
    logger.info(`Username validation response: ${response.status()}`);
    return response;
  }

  async getJobTitles(activeOnly?: boolean): Promise<APIResponse> {
    logger.info('Fetching job titles');
    const params = activeOnly !== undefined ? `?activeOnly=${activeOnly}` : '';
    const response = await this.request.get(`${this.url(API_ROUTES.adminJobTitles)}${params}`);
    logger.info(`GET job titles response: ${response.status()}`);
    return response;
  }

  async getJobTitle(id: number): Promise<APIResponse> {
    logger.info(`Fetching job title ${id}`);
    const response = await this.request.get(`${this.url(API_ROUTES.adminJobTitles)}/${id}`);
    logger.info(`GET job title ${id} response: ${response.status()}`);
    return response;
  }

  async createJobTitle(data: CreateJobTitleRequest): Promise<APIResponse> {
    logger.info(`Creating job title: ${data.title}`);
    const response = await this.request.post(this.url(API_ROUTES.adminJobTitles), { data });
    logger.info(`POST create job title response: ${response.status()}`);
    return response;
  }

  async updateJobTitle(id: number, data: UpdateJobTitleRequest): Promise<APIResponse> {
    logger.info(`Updating job title ${id}: ${data.title}`);
    const response = await this.request.put(`${this.url(API_ROUTES.adminJobTitles)}/${id}`, {
      data,
    });
    logger.info(`PUT update job title response: ${response.status()}`);
    return response;
  }

  async deleteJobTitles(ids: number[]): Promise<APIResponse> {
    logger.info(`Deleting job titles: [${ids.join(', ')}]`);
    const response = await this.request.delete(this.url(API_ROUTES.adminJobTitles), {
      data: { ids },
    });
    logger.info(`DELETE job titles response: ${response.status()}`);
    return response;
  }
}
