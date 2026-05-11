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

export type BrowserName = 'chromium' | 'firefox' | 'webkit';
