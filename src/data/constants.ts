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

export const SIDEBAR_MENU_ITEMS: Record<string, string> = {
  Admin: '/web/index.php/admin/viewAdminModule',
  PIM: '/web/index.php/pim/viewPimModule',
  Leave: '/web/index.php/leave/viewLeaveModule',
  Time: '/web/index.php/time/viewTimeModule',
  Recruitment: '/web/index.php/recruitment/viewRecruitmentModule',
  'My Info': '/web/index.php/pim/viewMyDetails',
  Performance: '/web/index.php/performance/viewPerformanceModule',
  Dashboard: '/web/index.php/dashboard/index',
  Directory: '/web/index.php/directory/viewDirectory',
  Maintenance: '/web/index.php/maintenance/viewMaintenanceModule',
  Claim: '/web/index.php/claim/viewClaimModule',
  Buzz: '/web/index.php/buzz/viewBuzz',
};

export const LABELS = {
  applicationName: 'OrangeHRM',
  loginTitle: 'Login',
  dashboardTitle: 'Dashboard',
  forgotPasswordTitle: 'Reset Password',
  resetLinkSent: 'Reset Password link sent successfully',
};

export const BREADCRUMBS: Record<string, { module: string; level?: string }> = {
  Admin: { module: 'Admin', level: 'User Management' },
  PIM: { module: 'PIM' },
  Leave: { module: 'Leave' },
  Time: { module: 'Time', level: 'Timesheets' },
  Recruitment: { module: 'Recruitment' },
  'My Info': { module: 'PIM' },
  Performance: { module: 'Performance', level: 'Manage Reviews' },
  Directory: { module: 'Directory' },
  Buzz: { module: 'Buzz' },
  Dashboard: { module: 'Dashboard' },
};

export const MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  requiredField: 'Required',
  resetEmailSent: 'A reset password link has been sent to you via email.',
};
