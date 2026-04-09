import { test, expect, uniqueEmail, addJobApi } from '../fixtures/api';
import { msg } from '../utils/constants';
import { expectApiError } from '../utils/response-helpers';
import {
  registerUser,
  loginUser,
  addBike,
  listJobsApi,
  updateJobApi,
} from '../utils/api-helpers';

test.describe('Jobs API', () => {
  test.describe('Create/list bike jobs', () => {
    test('Create job with valid data succeeds', async ({
      request,
      loginResult,
      garageWithBike,
      validJobData,
    }) => {
      await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        { ...validJobData },
      );

      const response = await listJobsApi(request, loginResult.body.user.id);

      const body = await response.json();

      expect(body.jobs).toHaveLength(1);
      expect(
        body.jobs.every((job) => job.user_id === loginResult.body.user.id),
      ).toBeTruthy();
      expect(
        body.jobs.every((job) => job.bike_id === garageWithBike.body.bike.id),
      ).toBeTruthy();
      expect(body.jobs.every((job) => job.status === 'requested')).toBeTruthy();
    });

    test('Create job with missing bike_id is rejected', async ({
      request,
      loginResult,
    }) => {
      const response = await addJobApi(
        request,
        undefined,
        loginResult.body.user.id,
        {
          service_type: 'Oil change',
          odometer: 24500,
          note: 'Change the oil',
        },
      );

      await expectApiError(response, 400, msg.BIKE_ID_REQUIRED);
    });

    test('Create job with missing service_type is rejected', async ({
      request,
      loginResult,
      garageWithBike,
    }) => {
      const response = await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        { odometer: 24500, note: 'Change the oil' },
      );

      await expectApiError(response, 400, msg.SERVICE_TYPE_REQUIRED);
    });

    test('Create job with missing odometer is rejected', async ({
      request,
      loginResult,
      garageWithBike,
    }) => {
      const response = await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        { service_type: 'Oil change', note: 'Change the oil' },
      );

      await expectApiError(response, 400, msg.ODOMETER_REQUIRED);
    });

    test('Create job with invalid negative odometer is rejected', async ({
      request,
      loginResult,
      garageWithBike,
    }) => {
      const response = await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        {
          service_type: 'Oil change',
          odometer: -1000,
          note: 'Change the oil',
        },
      );

      await expectApiError(response, 400, msg.ODOMETER_NEGATIVE);
    });

    test('Create job with invalid string odometer is rejected', async ({
      request,
      loginResult,
      garageWithBike,
    }) => {
      const response = await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        {
          service_type: 'Oil change',
          odometer: '1000',
          note: 'Change the oil',
        },
      );

      await expectApiError(response, 400, msg.ODOMETER_MUST_BE_NUMBER);
    });

    test('Jobs list returns only current user jobs', async ({
      request,
      loginResult,
      garageWithBike,
      validJobData,
    }) => {
      await addJobApi(
        request,
        garageWithBike.body.bike.id,
        loginResult.body.user.id,
        { ...validJobData },
      );

      const email = uniqueEmail();

      await registerUser(request, email);

      const body = await loginUser(request, email);

      const user_2_id = body.user.id;

      const bike_2 = await addBike(request, user_2_id);

      await addJobApi(request, bike_2, user_2_id, { ...validJobData });
      await addJobApi(request, bike_2, user_2_id, {
        service_type: 'Oil change',
        odometer: 1000,
      });

      const user_1_response = await listJobsApi(
        request,
        loginResult.body.user.id,
      );
      const user_1_body = await user_1_response.json();

      const user_2_response = await listJobsApi(request, user_2_id);

      const user_2_body = await user_2_response.json();

      expect(user_1_body.jobs).toHaveLength(1);
      expect(
        user_1_body.jobs.every(
          (job) => job.user_id === loginResult.body.user.id,
        ),
      ).toBeTruthy();
      expect(
        user_1_body.jobs.every(
          (job) => job.bike_id === garageWithBike.body.bike.id,
        ),
      ).toBeTruthy();

      expect(user_2_body.jobs).toHaveLength(2);
      expect(
        user_2_body.jobs.every((job) => job.user_id === user_2_id),
      ).toBeTruthy();
      expect(
        user_2_body.jobs.every((job) => job.bike_id === bike_2),
      ).toBeTruthy();
      expect(
        user_2_body.jobs.every((job) => job.status === 'requested'),
      ).toBeTruthy();
    });

    test('Update non-existing job is rejected', async ({
      request,
      loginResult,
    }) => {
      const response = await updateJobApi(
        request,
        undefined,
        loginResult.body.user.id,
        'approved',
      );

      expect(response.status()).toBe(404);
    });

    test('Update other user job is rejected', async ({
      request,
      loginResult,
      garageWithBike,
      validJobData,
    }) => {
      const email = uniqueEmail();
      await registerUser(request, email);
      const body = await loginUser(request, email);
      const user_2_id = body.user.id;

      const bike_2 = await addBike(request, user_2_id);
      const add_job_response = await addJobApi(request, bike_2, user_2_id, {
        ...validJobData,
      });

      const job_body = await add_job_response.json();

      const response = await updateJobApi(
        request,
        job_body.id,
        loginResult.body.user.id,
        'approved',
      );

      await expectApiError(response, 403, msg.FORBIDDEN);
    });
  });

  test.describe('Valid job status transitions', () => {
    test('Requested > Approved job transition is accepted', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      const jobs = await listJobsApi(request, bikeWithOneJob.user_id);

      const response = await jobs.json();

      expect(
        response.jobs.every((job) => job.status === 'approved'),
      ).toBeTruthy();
    });

    test('Approved > In progress job transition is accepted', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'in_progress',
      );

      const jobs = await listJobsApi(request, bikeWithOneJob.user_id);

      const response = await jobs.json();

      expect(
        response.jobs.every((job) => job.status === 'in_progress'),
      ).toBeTruthy();
    });

    test('In progress > Done job transition is accepted', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'in_progress',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'done',
      );

      const jobs = await listJobsApi(request, bikeWithOneJob.user_id);

      const response = await jobs.json();

      expect(response.jobs.every((job) => job.status === 'done')).toBeTruthy();
    });

    test('Requested > Cancelled job transition is accepted', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'cancelled',
      );

      const jobs = await listJobsApi(request, bikeWithOneJob.user_id);

      const response = await jobs.json();

      expect(
        response.jobs.every((job) => job.status === 'cancelled'),
      ).toBeTruthy();
    });

    test('Approved > Cancelled job transition is accepted', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'cancelled',
      );

      const jobs = await listJobsApi(request, bikeWithOneJob.user_id);

      const response = await jobs.json();

      expect(
        response.jobs.every((job) => job.status === 'cancelled'),
      ).toBeTruthy();
    });
  });

  test.describe('Invalid job status transitions', () => {
    test('Requested > Done job transition is rejected', async ({
      request,
      bikeWithOneJob,
    }) => {
      const response = await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'done',
      );

      await expectApiError(
        response,
        400,
        msg.INVALID_TRANSITION_REQUESTED_TO_DONE,
      );
    });

    test('Requested > In progress job transition is rejected', async ({
      request,
      bikeWithOneJob,
    }) => {
      const response = await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'in_progress',
      );

      await expectApiError(
        response,
        400,
        msg.INVALID_TRANSITION_REQUESTED_TO_IN_PROGRESS,
      );
    });

    test('Approved > Done job transition is rejected', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );
      const response = await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'done',
      );

      await expectApiError(response, 400, msg.INVALID_TRANSITION_APPROVED_TO_DONE);
    });

    test('Done > Approved job transition is rejected', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'in_progress',
      );

      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'done',
      );

      const response = await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await expectApiError(response, 400, msg.INVALID_TRANSITION_DONE_TO_APPROVED);
    });

    test('Cancelled > Approved job transition is rejected', async ({
      request,
      bikeWithOneJob,
    }) => {
      await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'cancelled',
      );

      const response = await updateJobApi(
        request,
        bikeWithOneJob.job.id,
        bikeWithOneJob.user_id,
        'approved',
      );

      await expectApiError(
        response,
        400,
        msg.INVALID_TRANSITION_CANCELLED_TO_APPROVED,
      );
    });
  });
});
