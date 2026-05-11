import type { UserCredentials } from '@typedefs/index';

export const validCredentials: UserCredentials = {
  username: 'Admin',
  password: 'admin123',
};

export const invalidCredentials: UserCredentials = {
  username: 'wrong',
  password: 'wrong',
};
