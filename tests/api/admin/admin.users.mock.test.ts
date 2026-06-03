import { test, expect } from '@fixtures/customFixtures';
import type { ApiUser, ApiErrorResponse } from '@typedefs/index';
import {
  mockUserList,
  mockCreateUserSuccess,
  mockCreateUserDuplicateError,
  mockCreateUserValidationError,
  mockCreateUserMissingEmployeeError,
} from '@data/adminUsersMocks';

test.describe('Admin Users API Mocks @api', () => {
  test('user list mock has expected data shape', () => {
    const data = mockUserList;

    expect(data.data).toHaveLength(2);
    expect(data.meta.total).toBe(2);

    const [admin, ess] = data.data as [ApiUser, ApiUser];
    expect(admin.id).toBe(1);
    expect(admin.userName).toBe('Admin');
    expect(admin.deleted).toBe(false);
    expect(admin.status).toBe(true);
    expect(admin.employee.empNumber).toBeGreaterThan(0);
    expect(admin.userRole.name).toBe('Admin');

    expect(ess.userRole.name).toBe('ESS');
  });

  test('create user success mock has expected data shape', () => {
    const data = mockCreateUserSuccess.data;

    expect(data).toBeDefined();
    expect(data.id).toBe(42);
    expect(data.userName).toBe('testuser_api');
    expect(data.status).toBe(true);
    expect(data.deleted).toBe(false);
    expect(data.employee.empNumber).toBeGreaterThan(0);
    expect(data.userRole.name).toBe('Admin');
  });

  test('duplicate username error mock has expected shape', () => {
    const data: ApiErrorResponse = mockCreateUserDuplicateError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('BAD_REQUEST');
    expect(data.error!.message).toContain('already exists');
    expect(data.errors).toHaveLength(1);
    expect(data.errors![0].field).toBe('username');
  });

  test('validation error mock has expected shape', () => {
    const data: ApiErrorResponse = mockCreateUserValidationError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('VALIDATION_FAILED');
    expect(data.errors).toHaveLength(1);
    expect(data.errors![0].field).toBe('password');
    expect(data.errors![0].message).toContain('digit');
  });

  test('missing employee error mock has expected shape', () => {
    const data: ApiErrorResponse = mockCreateUserMissingEmployeeError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('BAD_REQUEST');
    expect(data.error!.message).toBe('Employee not found');
    expect(data.errors![0].field).toBe('empNumber');
  });
});
