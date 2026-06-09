import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  ApiListResponse,
  ApiUser,
} from '@typedefs/index';

type ResponseRecord = {
  scenario: string;
  status: number;
  body: unknown;
  ok: boolean;
};

const responses: ResponseRecord[] = [];

test.describe('Admin Users API @api', () => {
  let empNumber: number;
  let createdUserId: number | null = null;

  test.beforeAll(async ({ authenticatedApiHelper }) => {
    const listRes = await authenticatedApiHelper.getUsers();
    expect(listRes.ok()).toBeTruthy();
    const body = (await listRes.json()) as ApiListResponse<ApiUser>;
    empNumber = body.data[0].employee.empNumber;
  });

  test.afterEach(() => {
    const last = responses[responses.length - 1];
    if (last) {
      // eslint-disable-next-line no-console
      console.log(`[${last.scenario}] ${last.status} — ${JSON.stringify(last.body).slice(0, 200)}`);
    }
  });

  test.afterAll(async ({ authenticatedApiHelper }) => {
    if (createdUserId) {
      await authenticatedApiHelper.deleteUsers([createdUserId]);
    }
  });

  test('creates an Admin user with valid data', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `api_admin_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'create admin user', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('id');
    expect(body.data.userName).toBe(data.username);
    createdUserId = body.data.id;
  });

  test('creates an ESS user with valid data', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `api_ess_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 2,
      empNumber,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'create ess user', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    expect(body.data.userRole.name).toBe('ESS');

    await authenticatedApiHelper.deleteUsers([body.data.id]);
  });

  test('rejects duplicate username', async ({ authenticatedApiHelper }) => {
    const username = `dup_${DataGenerator.generateRandomString(6).toLowerCase()}`;
    const password = `Test${DataGenerator.generateRandomString(4)}1!`;

    const first: CreateUserRequest = { username, password, status: true, userRoleId: 1, empNumber };
    const firstRes = await authenticatedApiHelper.createUser(first);
    const firstBody = await firstRes.json();
    const firstUserId = firstBody.data.id;

    const dup: CreateUserRequest = { username, password, status: true, userRoleId: 1, empNumber };
    const dupRes = await authenticatedApiHelper.createUser(dup);
    const dupBody = await dupRes.json();

    responses.push({
      scenario: 'duplicate username',
      status: dupRes.status(),
      body: dupBody,
      ok: dupRes.ok(),
    });

    expect(dupRes.ok()).not.toBeTruthy();
    expect(dupRes.status()).toBe(422);

    await authenticatedApiHelper.deleteUsers([firstUserId]);
  });

  test('rejects non-existent employee number', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `noemp_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber: 999999,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'invalid empNumber', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).not.toBeTruthy();
  });

  test('rejects short username', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: 'ab',
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'short username', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).not.toBeTruthy();
  });

  test('rejects weak password', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `weakpw_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: 'weak',
      status: true,
      userRoleId: 1,
      empNumber,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'weak password', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).not.toBeTruthy();
  });

  test('creates a disabled user', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `disabled_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: false,
      userRoleId: 1,
      empNumber,
    };

    const res = await authenticatedApiHelper.createUser(data);
    const body = await res.json();

    responses.push({ scenario: 'create disabled user', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).toBeTruthy();
    expect(body.data.status).toBe(false);

    await authenticatedApiHelper.deleteUsers([body.data.id]);
  });

  test('updates a user role to ESS', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `update_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber,
    };

    const createRes = await authenticatedApiHelper.createUser(data);
    const createBody = await createRes.json();
    const userId = createBody.data.id;

    const updateData: UpdateUserRequest = {
      username: data.username,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 2,
      empNumber,
      changePassword: true,
    };

    const updateRes = await authenticatedApiHelper.updateUser(userId, updateData);
    const updateBody = await updateRes.json();

    responses.push({
      scenario: 'update user role to ESS',
      status: updateRes.status(),
      body: updateBody,
      ok: updateRes.ok(),
    });

    expect(updateRes.ok()).toBeTruthy();
    expect(updateRes.status()).toBe(200);
    expect(updateBody.data.userRole.name).toBe('ESS');

    await authenticatedApiHelper.deleteUsers([userId]);
  });

  test('updates a user status to disabled', async ({ authenticatedApiHelper }) => {
    const data: CreateUserRequest = {
      username: `updstatus_${DataGenerator.generateRandomString(6).toLowerCase()}`,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber,
    };

    const createRes = await authenticatedApiHelper.createUser(data);
    const createBody = await createRes.json();
    const userId = createBody.data.id;

    const updateData: UpdateUserRequest = {
      username: data.username,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: false,
      userRoleId: 1,
      empNumber,
      changePassword: true,
    };

    const updateRes = await authenticatedApiHelper.updateUser(userId, updateData);
    const updateBody = await updateRes.json();

    responses.push({
      scenario: 'update user status to disabled',
      status: updateRes.status(),
      body: updateBody,
      ok: updateRes.ok(),
    });

    expect(updateRes.ok()).toBeTruthy();
    expect(updateRes.status()).toBe(200);
    expect(updateBody.data.status).toBe(false);

    await authenticatedApiHelper.deleteUsers([userId]);
  });

  test('rejects update to duplicate username', async ({ authenticatedApiHelper }) => {
    const username1 = `upddup_${DataGenerator.generateRandomString(6).toLowerCase()}`;
    const username2 = `upddup_${DataGenerator.generateRandomString(6).toLowerCase()}`;
    const password = `Test${DataGenerator.generateRandomString(4)}1!`;

    const user1 = await authenticatedApiHelper.createUser({
      username: username1,
      password,
      status: true,
      userRoleId: 1,
      empNumber,
    });
    const user1Body = await user1.json();

    const user2 = await authenticatedApiHelper.createUser({
      username: username2,
      password,
      status: true,
      userRoleId: 1,
      empNumber,
    });
    const user2Body = await user2.json();

    const dupUpdate: UpdateUserRequest = {
      username: username1,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber,
      changePassword: true,
    };

    const updateRes = await authenticatedApiHelper.updateUser(user2Body.data.id, dupUpdate);
    const updateBody = await updateRes.json();

    responses.push({
      scenario: 'reject update to duplicate username',
      status: updateRes.status(),
      body: updateBody,
      ok: updateRes.ok(),
    });

    expect(updateRes.ok()).not.toBeTruthy();
    expect(updateRes.status()).toBe(422);

    await authenticatedApiHelper.deleteUsers([user1Body.data.id, user2Body.data.id]);
  });
});
