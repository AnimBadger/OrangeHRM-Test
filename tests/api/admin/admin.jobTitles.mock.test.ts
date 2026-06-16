import { test, expect } from '@fixtures/customFixtures';
import type { ApiJobTitle, ApiErrorResponse } from '@typedefs/index';
import {
  mockJobTitleList,
  mockCreateJobTitleSuccess,
  mockCreateJobTitleDuplicateError,
  mockCreateJobTitleValidationError,
  mockUpdateJobTitleSuccess,
  mockUpdateJobTitleDuplicateError,
  mockGetJobTitleSuccess,
  mockJobTitleNotFound,
} from '@data/adminJobTitleMocks';

test.describe('Admin Job Titles API Mocks @api', () => {
  test('job title list mock has expected data shape', () => {
    const data = mockJobTitleList;

    expect(data.data).toHaveLength(2);
    expect(data.meta.total).toBe(2);

    const [ceo, sales] = data.data as [ApiJobTitle, ApiJobTitle];
    expect(ceo.id).toBe(1);
    expect(ceo.title).toBe('Chief Executive Officer');
    expect(ceo.description).toBeTruthy();
    expect(ceo.note).toBeTruthy();

    expect(sales.title).toBe('Sales Representative');
    expect(sales.note).toBeNull();
  });

  test('create job title success mock has expected data shape', () => {
    const data = mockCreateJobTitleSuccess.data;

    expect(data).toBeDefined();
    expect(data.id).toBe(42);
    expect(data.title).toBe('QA Engineer');
    expect(data.description).toBe('Responsible for quality assurance and testing');
    expect(data.note).toBe('New position');
  });

  test('create duplicate error mock has expected shape', () => {
    const data: ApiErrorResponse = mockCreateJobTitleDuplicateError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('400');
    expect(data.errors).toHaveLength(1);
    expect(data.errors![0].field).toBe('title');
    expect(data.errors![0].message).toBe('Already exists');
  });

  test('create validation error mock has expected shape', () => {
    const data: ApiErrorResponse = mockCreateJobTitleValidationError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('VALIDATION_FAILED');
    expect(data.errors).toHaveLength(1);
    expect(data.errors![0].field).toBe('title');
    expect(data.errors![0].message).toBe('Required');
  });

  test('update job title success mock has expected data shape', () => {
    const data = mockUpdateJobTitleSuccess.data;

    expect(data).toBeDefined();
    expect(data.id).toBe(42);
    expect(data.title).toBe('Senior QA Engineer');
    expect(data.description).toBe('Leads quality assurance initiatives');
    expect(data.note).toBe('Updated position');
  });

  test('update duplicate error mock has expected shape', () => {
    const data: ApiErrorResponse = mockUpdateJobTitleDuplicateError;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('422');
    expect(data.errors).toHaveLength(1);
    expect(data.errors![0].field).toBe('title');
    expect(data.errors![0].message).toBe('Already exists');
  });

  test('get job title by id success mock has expected data shape', () => {
    const data = mockGetJobTitleSuccess.data;

    expect(data).toBeDefined();
    expect(data.id).toBe(1);
    expect(data.title).toBe('Chief Executive Officer');
    expect(data.description).toBe('Top-level executive responsible for overall operations');
  });

  test('job title not found error mock has expected shape', () => {
    const data: ApiErrorResponse = mockJobTitleNotFound;

    expect(data.error).toBeDefined();
    expect(data.error!.status).toBe('404');
    expect(data.error!.message).toBe('Record Not Found');
  });
});
