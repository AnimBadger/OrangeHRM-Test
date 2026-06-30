export const emptyFieldCases = [
  {
    description: 'submitting without username shows field error',
    username: '',
    password: 'somePassword123',
  },
  { description: 'submitting without password shows field error', username: 'Admin', password: '' },
];

export const shortInputCases = [
  {
    description: 'single char username should show minimum length validation',
    username: 'a',
    password: 'Admin123',
  },
  {
    description: 'single char password should show minimum length validation',
    username: 'Admin',
    password: 'a',
  },
];
