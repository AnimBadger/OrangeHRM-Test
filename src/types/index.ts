export interface UserCredentials {
  username: string;
  password: string;
}

export interface Employee {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId?: string;
}

export interface TestUser {
  role: 'admin' | 'ess' | 'supervisor';
  credentials: UserCredentials;
}

export interface NavigationItem {
  name: string;
  route: string;
  subItems?: NavigationItem[];
}

export interface SystemUser {
  userRole: 'Admin' | 'ESS';
  employeeName: string;
  status: 'Enabled' | 'Disabled';
  username: string;
  password: string;
}

export type UserRole = 'Admin' | 'ESS';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface JobTitle {
  title: string;
  description?: string;
  note?: string;
}

export interface PayGrade {
  name: string;
}

export interface EmploymentStatus {
  name: string;
}

export interface JobCategory {
  name: string;
}

export interface WorkShift {
  name: string;
  from?: string;
  to?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  status: boolean;
  userRoleId: number;
  empNumber: number;
}

export interface ApiUser {
  id: number;
  userName: string;
  deleted: boolean;
  status: boolean;
  employee: {
    empNumber: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    employeeId?: string;
    terminationId?: number | null;
  };
  userRole: {
    id: number;
    name: string;
    displayName: string;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number };
  rels: string[];
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error?: {
    status: string;
    message: string;
  };
  errors?: ApiErrorDetail[];
}

export interface UserRoleOption {
  id: number;
  name: string;
  displayName: string;
  isAssignable: boolean;
}
