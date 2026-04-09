import {
  test,
  expect,
  uniqueEmail,
  addBikeApi,
  addJobApi,
} from '../fixtures/api';
import { msg } from '../utils/constants';
import { expectApiError, expectApiSuccess } from '../utils/response-helpers';
import {
  registerUser,
  loginUser,
  addBike,
  listBikesApi,
  deleteBikeApi,
  listJobsApi,
} from '../utils/api-helpers';

test.describe('MST - Garage API', () => {
  test('Create bike with valid data returns 201', async ({
    request,
    loginResult,
    validBikeData,
  }) => {
    const response = await addBikeApi(
      request,
      loginResult.body.user.id,
      validBikeData,
    );

    await expectApiSuccess(response, 201, msg.BIKE_CREATE_SUCCESS);
  });

  test('Create bike with missing make returns 400', async ({
    loginResult,
    request,
  }) => {
    const response = await addBikeApi(request, loginResult.body.user.id, {
      model: 'Tracer 9GT',
      year: 2020,
    });

    await expectApiError(response, 400, msg.MAKE_REQUIRED);
  });

  test('Create bike with missing model returns 400', async ({
    request,
    loginResult,
  }) => {
    const response = await addBikeApi(request, loginResult.body.user.id, {
      make: 'Yamaha',
      year: 2020,
    });

    await expectApiError(response, 400, msg.MODEL_REQUIRED);
  });

  test('Create bike with missing year returns 400', async ({
    request,
    loginResult,
  }) => {
    const response = await addBikeApi(request, loginResult.body.user.id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
    });

    await expectApiError(response, 400, msg.YEAR_REQUIRED);
  });

  test('Create bike with invalid year < 1900 returns 400', async ({
    request,
    loginResult,
  }) => {
    const response = await addBikeApi(request, loginResult.body.user.id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 1899,
    });

    await expectApiError(response, 400, msg.YEAR_OUT_OF_RANGE);
  });

  test('Create bike with invalid year > 2100 returns 400', async ({
    request,
    loginResult,
  }) => {
    const response = await addBikeApi(request, loginResult.body.user.id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2101,
    });

    await expectApiError(response, 400, msg.YEAR_OUT_OF_RANGE);
  });

  test('Bikes list returns only current user bikes', async ({
    request,
    loginResult,
  }) => {
    await addBikeApi(request, loginResult.body.user.id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2021,
    });

    const user_2_email = uniqueEmail();

    await registerUser(request, user_2_email);

    const user_2_login = await loginUser(request, user_2_email);
    const user_2_id = user_2_login.user.id;

    await addBikeApi(request, user_2_id, {
      make: 'Honda',
      model: 'Rebel',
      year: 2020,
    });

    const bikes = await listBikesApi(request, loginResult.body.user.id);

    expect(bikes.length).toBe(1);
    expect(
      bikes.every((bike) => bike.user_id === loginResult.body.user.id),
    ).toBe(true);
    expect(bikes.some((bike) => bike.make === 'Honda')).toBe(false);
  });

  test('Deleting a bike removes it from the database', async ({
    request,
    loginResult,
  }) => {
    const bike_id = await addBike(request, loginResult.body.user.id);

    const deleteResponse = await deleteBikeApi(
      request,
      bike_id,
      loginResult.body.user.id,
    );

    await expectApiSuccess(deleteResponse, 200, msg.BIKE_DELETE_SUCCESS);

    const bikes = await listBikesApi(request, loginResult.body.user.id);
    expect(bikes).toHaveLength(0);
  });

  test('Deleting bike removes related jobs', async ({
    request,
    loginResult,
  }) => {
    const bike_id = await addBike(request, loginResult.body.user.id);

    await addJobApi(request, bike_id, loginResult.body.user.id);

    const deleteResponse = await deleteBikeApi(
      request,
      bike_id,
      loginResult.body.user.id,
    );
    await expectApiSuccess(deleteResponse, 200, msg.BIKE_DELETE_SUCCESS);

    const jobsResponse = await listJobsApi(request, loginResult.body.user.id);

    expect(jobsResponse.status()).toBe(200);

    const jobsBody = await jobsResponse.json();
    expect(jobsBody.jobs).toHaveLength(0);
  });
});
