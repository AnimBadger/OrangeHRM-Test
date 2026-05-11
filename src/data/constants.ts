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
  forgotPassword: '/web/index.php/auth/requestPasswordReset',
  sendPasswordReset: '/web/index.php/auth/sendPasswordReset',
};

export const LABELS = {
  applicationName: 'OrangeHRM',
  loginTitle: 'Login',
  dashboardTitle: 'Dashboard',
  forgotPasswordTitle: 'Reset Password',
  resetLinkSent: 'Reset Password link sent successfully',
};

export const MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  requiredField: 'Required',
  resetEmailSent: 'A reset password link has been sent to you via email.',
};
