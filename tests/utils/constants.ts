export const API_URL = 'http://127.0.0.1:3001';
export const PASSWORD = 'testingpass';

export const msg = {
  USER_REG_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  BIKE_CREATE_SUCCESS: 'Bike created successfully',
  BIKE_DELETE_SUCCESS: 'Bike deleted successfully',
  USER_EXISTS: 'User already exists',
  EMAIL_INVALID: 'Invalid email format',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_MAX_LENGTH: 'Password must be 32 characters at most',
  INVALID_CREDENTIALS: 'Invalid credentials',
  MAKE_REQUIRED: 'Make is required',
  MODEL_REQUIRED: 'Model is required',
  YEAR_REQUIRED: 'Year is required',
  YEAR_OUT_OF_RANGE: 'Year must be an integer between 1900 and 2100',
  BIKE_ID_REQUIRED: 'bike_id is required',
  SERVICE_TYPE_REQUIRED: 'service_type is required',
  ODOMETER_REQUIRED: 'odometer is required',
  ODOMETER_NEGATIVE: 'odometer cannot be a negative integer',
  ODOMETER_MUST_BE_NUMBER: 'odometer must be a number',
  FORBIDDEN: 'Forbidden',
  INVALID_TRANSITION_REQUESTED_TO_DONE:
    'Invalid status transition from requested to done',
  INVALID_TRANSITION_REQUESTED_TO_IN_PROGRESS:
    'Invalid status transition from requested to in_progress',
  INVALID_TRANSITION_APPROVED_TO_DONE:
    'Invalid status transition from approved to done',
  INVALID_TRANSITION_DONE_TO_APPROVED:
    'Invalid status transition from done to approved',
  INVALID_TRANSITION_CANCELLED_TO_APPROVED:
    'Invalid status transition from cancelled to approved',
} as const;
