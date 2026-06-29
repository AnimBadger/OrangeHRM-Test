import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import type {
  ApiListResponse,
  ApiSingleResponse,
  ApiJobTitle,
  CreateJobTitleRequest,
} from '@typedefs/index';

type ResponseRecord = {
  scenario: string;
  status: number;
  body: unknown;
  ok: boolean;
};

const responses: ResponseRecord[] = [];
const cleanupIds: number[] = [];

test.describe('Admin Job Titles API @api', () => {
  test.afterEach(() => {
    const last = responses[responses.length - 1];
    if (last) {
      // eslint-disable-next-line no-console
      console.log(`[${last.scenario}] ${last.status} — ${JSON.stringify(last.body).slice(0, 200)}`);
    }
  });

  test.afterAll(async ({ authenticatedApiHelper }) => {
    if (cleanupIds.length > 0) {
      await authenticatedApiHelper.deleteJobTitles(cleanupIds);
    }
  });

  test('lists all job titles successfully', async ({ authenticatedApiHelper }) => {
    const res = await authenticatedApiHelper.getJobTitles();
    const body = (await res.json()) as ApiListResponse<ApiJobTitle>;

    responses.push({ scenario: 'list all job titles', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta.total).toBeGreaterThan(0);
  });

  test('get a single job title by id', async ({ authenticatedApiHelper }) => {
    const listRes = await authenticatedApiHelper.getJobTitles();
    const listBody = (await listRes.json()) as ApiListResponse<ApiJobTitle>;
    const firstId = listBody.data[0].id;

    const res = await authenticatedApiHelper.getJobTitle(firstId);
    const body = (await res.json()) as ApiSingleResponse<ApiJobTitle>;

    responses.push({ scenario: 'get job title by id', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    expect(body.data.id).toBe(firstId);
    expect(body.data.title).toBeTruthy();
  });

  test('get non-existent job title returns 404', async ({ authenticatedApiHelper }) => {
    const res = await authenticatedApiHelper.getJobTitle(999999);
    const body = await res.json();

    responses.push({
      scenario: 'get non-existent job title',
      status: res.status(),
      body,
      ok: res.ok(),
    });

    expect(res.ok()).not.toBeTruthy();
    expect(res.status()).toBe(404);
  });

  const successCases: {
    name: string;
    buildData: () => CreateJobTitleRequest;
    assertions?: (body: ApiSingleResponse<ApiJobTitle>) => void;
  }[] = [
    {
      name: 'creates a job title with only title',
      buildData: () => ({ title: `QA_API_${DataGenerator.generateRandomString(6)}` }),
    },
    {
      name: 'creates a job title with title and description',
      buildData: () => ({
        title: `QA_API_${DataGenerator.generateRandomString(6)}`,
        description: `Description for API test ${DataGenerator.generateRandomString(10)}`,
      }),
    },
    {
      name: 'creates a job title with title, description, and note',
      buildData: () => ({
        title: `QA_API_${DataGenerator.generateRandomString(6)}`,
        description: `Description ${DataGenerator.generateRandomString(8)}`,
        note: `Note ${DataGenerator.generateRandomString(8)}`,
      }),
      assertions: (body) => {
        expect(body.data.note).toBeTruthy();
      },
    },
  ];

  for (const { name, buildData, assertions } of successCases) {
    test(name, async ({ authenticatedApiHelper }) => {
      const data = buildData();
      const res = await authenticatedApiHelper.createJobTitle(data);
      const body = (await res.json()) as ApiSingleResponse<ApiJobTitle>;
      const verify = assertions ?? (() => {});

      responses.push({ scenario: name, status: res.status(), body, ok: res.ok() });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data.title).toBe(data.title);
      cleanupIds.push(body.data.id);

      verify(body);
    });
  }

  test('rejects empty title', async ({ authenticatedApiHelper }) => {
    const res = await authenticatedApiHelper.createJobTitle({ title: '' });
    const body = await res.json();

    responses.push({ scenario: 'rejects empty title', status: res.status(), body, ok: res.ok() });

    expect(res.ok()).not.toBeTruthy();
    expect(res.status()).toBe(422);
  });

  test('rejects duplicate job title', async ({ authenticatedApiHelper }) => {
    const title = `dup_${DataGenerator.generateRandomString(6)}`;

    const firstRes = await authenticatedApiHelper.createJobTitle({ title });
    const firstBody = await firstRes.json();
    cleanupIds.push(firstBody.data.id);

    const dupRes = await authenticatedApiHelper.createJobTitle({ title });
    const dupBody = await dupRes.json();

    responses.push({
      scenario: 'duplicate job title',
      status: dupRes.status(),
      body: dupBody,
      ok: dupRes.ok(),
    });

    expect(dupRes.ok()).not.toBeTruthy();
  });

  test('updates a job title successfully', async ({ authenticatedApiHelper }) => {
    const originalTitle = `QA_API_${DataGenerator.generateRandomString(6)}`;
    const updatedTitle = `QA_API_${DataGenerator.generateRandomString(6)}`;

    const createRes = await authenticatedApiHelper.createJobTitle({ title: originalTitle });
    const createBody = (await createRes.json()) as ApiSingleResponse<ApiJobTitle>;
    const jobTitleId = createBody.data.id;
    cleanupIds.push(jobTitleId);

    const updateRes = await authenticatedApiHelper.updateJobTitle(jobTitleId, {
      title: updatedTitle,
      description: 'Updated description via API',
      note: 'Updated note',
    });
    const updateBody = (await updateRes.json()) as ApiSingleResponse<ApiJobTitle>;

    responses.push({
      scenario: 'update job title',
      status: updateRes.status(),
      body: updateBody,
      ok: updateRes.ok(),
    });

    expect(updateRes.ok()).toBeTruthy();
    expect(updateRes.status()).toBe(200);
    expect(updateBody.data.title).toBe(updatedTitle);
    expect(updateBody.data.description).toBe('Updated description via API');
    expect(updateBody.data.note).toBe('Updated note');
  });

  test('updates a job title title only', async ({ authenticatedApiHelper }) => {
    const originalTitle = `QA_API_${DataGenerator.generateRandomString(6)}`;
    const updatedTitle = `QA_API_${DataGenerator.generateRandomString(6)}`;

    const createRes = await authenticatedApiHelper.createJobTitle({ title: originalTitle });
    const createBody = (await createRes.json()) as ApiSingleResponse<ApiJobTitle>;
    const jobTitleId = createBody.data.id;
    cleanupIds.push(jobTitleId);

    const updateRes = await authenticatedApiHelper.updateJobTitle(jobTitleId, {
      title: updatedTitle,
    });
    const updateBody = (await updateRes.json()) as ApiSingleResponse<ApiJobTitle>;

    responses.push({
      scenario: 'update job title title only',
      status: updateRes.status(),
      body: updateBody,
      ok: updateRes.ok(),
    });

    expect(updateRes.ok()).toBeTruthy();
    expect(updateRes.status()).toBe(200);
    expect(updateBody.data.title).toBe(updatedTitle);
  });

  test('deletes a job title', async ({ authenticatedApiHelper }) => {
    const title = `QA_API_${DataGenerator.generateRandomString(6)}`;
    const createRes = await authenticatedApiHelper.createJobTitle({ title });
    const createBody = (await createRes.json()) as ApiSingleResponse<ApiJobTitle>;
    const jobTitleId = createBody.data.id;

    const delRes = await authenticatedApiHelper.deleteJobTitles([jobTitleId]);
    const delBody = await delRes.json();

    responses.push({
      scenario: 'delete job title',
      status: delRes.status(),
      body: delBody,
      ok: delRes.ok(),
    });

    expect(delRes.ok()).toBeTruthy();
    expect(delRes.status()).toBe(200);
  });

  test('delete non-existent job title returns 404', async ({ authenticatedApiHelper }) => {
    const res = await authenticatedApiHelper.deleteJobTitles([999999]);
    const body = await res.json();

    responses.push({
      scenario: 'delete non-existent job title',
      status: res.status(),
      body,
      ok: res.ok(),
    });

    expect(res.ok()).not.toBeTruthy();
    expect(res.status()).toBe(404);
  });
});
