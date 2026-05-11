export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

export const ROUTES = {
  login: '/web/index.php/auth/login',
  dashboard: '/web/index.php/dashboard/index',
  pim: '/web/index.php/pim/viewEmployeeList',
  leave: '/web/index.php/leave/viewLeaveList',
  recruitment: '/web/index.php/recruitment/viewCandidates',
  admin: '/web/index.php/admin/viewSystemUsers',
};

export const LABELS = {
  applicationName: 'OrangeHRM',
  loginTitle: 'Login',
  dashboardTitle: 'Dashboard',
};

export const MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  requiredField: 'Required',
};
