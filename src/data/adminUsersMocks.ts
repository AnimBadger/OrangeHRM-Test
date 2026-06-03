import type {
  ApiListResponse,
  ApiSingleResponse,
  ApiErrorResponse,
  ApiUser,
} from '@typedefs/index';

export const mockUserList: ApiListResponse<ApiUser> = {
  data: [
    {
      id: 1,
      userName: 'Admin',
      deleted: false,
      userRole: { id: 1, name: 'Admin', displayName: 'Admin' },
      status: true,
      employee: {
        empNumber: 7,
        firstName: 'Odis',
        lastName: 'Adalwin',
        employeeId: 'EMP001',
        terminationId: null,
      },
    },
    {
      id: 2,
      userName: 'ESSUser',
      deleted: false,
      userRole: { id: 2, name: 'ESS', displayName: 'ESS' },
      status: true,
      employee: {
        empNumber: 8,
        firstName: 'John',
        lastName: 'Smith',
        employeeId: 'EMP002',
        terminationId: null,
      },
    },
  ],
  meta: { total: 2 },
  rels: [],
};

export const mockCreateUserSuccess: ApiSingleResponse<ApiUser> = {
  data: {
    id: 42,
    userName: 'testuser_api',
    deleted: false,
    userRole: { id: 1, name: 'Admin', displayName: 'Admin' },
    status: true,
    employee: {
      empNumber: 7,
      firstName: 'Odis',
      lastName: 'Adalwin',
      employeeId: 'EMP001',
      terminationId: null,
    },
  },
};

export const mockCreateUserDuplicateError: ApiErrorResponse = {
  error: {
    status: 'BAD_REQUEST',
    message: 'Username already exists',
  },
  errors: [
    {
      field: 'username',
      message: 'Already exists',
    },
  ],
};

export const mockCreateUserValidationError: ApiErrorResponse = {
  error: {
    status: 'VALIDATION_FAILED',
    message: 'Validation failed',
  },
  errors: [
    {
      field: 'password',
      message: 'Password should contain at least 1 digit and 1 special character',
    },
  ],
};

export const mockCreateUserMissingEmployeeError: ApiErrorResponse = {
  error: {
    status: 'BAD_REQUEST',
    message: 'Employee not found',
  },
  errors: [
    {
      field: 'empNumber',
      message: 'Employee not found',
    },
  ],
};
