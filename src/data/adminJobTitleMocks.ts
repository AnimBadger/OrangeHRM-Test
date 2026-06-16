import type {
  ApiListResponse,
  ApiSingleResponse,
  ApiErrorResponse,
  ApiJobTitle,
} from '@typedefs/index';

export const mockJobTitleList: ApiListResponse<ApiJobTitle> = {
  data: [
    {
      id: 1,
      title: 'Chief Executive Officer',
      description: 'Top-level executive responsible for overall operations',
      note: 'Board-appointed position',
    },
    {
      id: 2,
      title: 'Sales Representative',
      description: 'Handles client acquisition and relationship management',
      note: null,
    },
  ],
  meta: { total: 2 },
  rels: [],
};

export const mockCreateJobTitleSuccess: ApiSingleResponse<ApiJobTitle> = {
  data: {
    id: 42,
    title: 'QA Engineer',
    description: 'Responsible for quality assurance and testing',
    note: 'New position',
  },
};

export const mockCreateJobTitleDuplicateError: ApiErrorResponse = {
  error: {
    status: '400',
    message: 'Bad Request',
  },
  errors: [
    {
      field: 'title',
      message: 'Already exists',
    },
  ],
};

export const mockCreateJobTitleValidationError: ApiErrorResponse = {
  error: {
    status: 'VALIDATION_FAILED',
    message: 'Validation failed',
  },
  errors: [
    {
      field: 'title',
      message: 'Required',
    },
  ],
};

export const mockUpdateJobTitleSuccess: ApiSingleResponse<ApiJobTitle> = {
  data: {
    id: 42,
    title: 'Senior QA Engineer',
    description: 'Leads quality assurance initiatives',
    note: 'Updated position',
  },
};

export const mockUpdateJobTitleDuplicateError: ApiErrorResponse = {
  error: {
    status: '422',
    message: 'Invalid Parameter',
  },
  errors: [
    {
      field: 'title',
      message: 'Already exists',
    },
  ],
};

export const mockGetJobTitleSuccess: ApiSingleResponse<ApiJobTitle> = {
  data: {
    id: 1,
    title: 'Chief Executive Officer',
    description: 'Top-level executive responsible for overall operations',
    note: 'Board-appointed position',
  },
};

export const mockJobTitleNotFound: ApiErrorResponse = {
  error: {
    status: '404',
    message: 'Record Not Found',
  },
};
