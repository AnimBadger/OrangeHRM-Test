import type { TestUser } from '@types/index';

export const testUsers: Record<string, TestUser> = {
  admin: {
    role: 'admin',
    credentials: {
      username: 'Admin',
      password: 'admin123',
    },
  },
};

export const apiEndpoints = {
  login: '/auth/login',
  employees: '/pim/employees',
  candidates: '/recruitment/candidates',
};
