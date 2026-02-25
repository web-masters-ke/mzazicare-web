/**
 * API Exception Classes
 * Typed exception hierarchy for API errors
 * Mirrors mobile app's ApiException
 */

import { AxiosError } from 'axios';

/**
 * Base API Exception
 */
export abstract class ApiException extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Get user-friendly message
   */
  getUserMessage(): string {
    return this.message;
  }
}

/**
 * Network Exception - No internet or socket errors
 */
export class NetworkException extends ApiException {
  constructor(message: string = 'No internet connection. Please check your network.') {
    super(message, undefined);
  }
}

/**
 * Timeout Exception - Request timeout
 */
export class TimeoutException extends ApiException {
  constructor(message: string = 'Request timeout. Please try again.') {
    super(message, 408);
  }
}

/**
 * Unauthorized Exception - 401
 */
export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Unauthorized. Please login again.') {
    super(message, 401);
  }
}

/**
 * Forbidden Exception - 403
 */
export class ForbiddenException extends ApiException {
  constructor(message: string = 'Access forbidden.') {
    super(message, 403);
  }
}

/**
 * Not Found Exception - 404
 */
export class NotFoundException extends ApiException {
  constructor(message: string = 'Resource not found.') {
    super(message, 404);
  }
}

/**
 * Validation Exception - 400/422
 */
export class ValidationException extends ApiException {
  constructor(
    message: string = 'Validation failed.',
    public errors?: Record<string, string[]>
  ) {
    super(message, 422);
  }

  /**
   * Get field-level errors
   */
  getFieldErrors(): Record<string, string[]> {
    return this.errors || {};
  }

  /**
   * Get first error for a field
   */
  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }
}

/**
 * Conflict Exception - 409
 */
export class ConflictException extends ApiException {
  constructor(message: string = 'Resource conflict.') {
    super(message, 409);
  }
}

/**
 * Rate Limit Exception - 429
 */
export class RateLimitException extends ApiException {
  constructor(
    message: string = 'Too many requests. Please try again later.',
    public retryAfter?: number
  ) {
    super(message, 429);
  }
}

/**
 * Server Exception - 5xx
 */
export class ServerException extends ApiException {
  constructor(message: string = 'Server error. Please try again later.', statusCode?: number) {
    super(message, statusCode || 500);
  }
}

/**
 * Unknown Exception - Catch-all
 */
export class UnknownException extends ApiException {
  constructor(message: string = 'An unknown error occurred.') {
    super(message, undefined);
  }
}

/**
 * Convert Axios Error to ApiException
 */
export function convertToApiException(error: AxiosError): ApiException {
  // Network errors (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new TimeoutException();
    }
    return new NetworkException();
  }

  const { status, data } = error.response;
  const message = extractErrorMessage(data);

  // HTTP status code based exceptions
  switch (status) {
    case 400:
    case 422:
      const errors = extractValidationErrors(data);
      return new ValidationException(message, errors);

    case 401:
      return new UnauthorizedException(message);

    case 403:
      return new ForbiddenException(message);

    case 404:
      return new NotFoundException(message);

    case 409:
      return new ConflictException(message);

    case 429:
      const retryAfter = extractRetryAfter(error.response.headers);
      return new RateLimitException(message, retryAfter);

    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerException(message, status);

    default:
      return new UnknownException(message);
  }
}

/**
 * Extract error message from response data
 */
function extractErrorMessage(data: any): string {
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.msg) return data.msg;
  return 'An error occurred';
}

/**
 * Extract validation errors from response data
 */
function extractValidationErrors(data: any): Record<string, string[]> | undefined {
  if (!data?.errors) return undefined;

  // Handle different error formats
  if (Array.isArray(data.errors)) {
    // Array format: [{field: 'email', message: 'Invalid'}]
    const errors: Record<string, string[]> = {};
    data.errors.forEach((err: any) => {
      if (err.field && err.message) {
        if (!errors[err.field]) errors[err.field] = [];
        errors[err.field].push(err.message);
      }
    });
    return errors;
  }

  if (typeof data.errors === 'object') {
    // Object format: {email: ['Invalid', 'Required']}
    return data.errors;
  }

  return undefined;
}

/**
 * Extract retry-after header
 */
function extractRetryAfter(headers: any): number | undefined {
  const retryAfter = headers?.['retry-after'];
  if (!retryAfter) return undefined;

  const seconds = parseInt(retryAfter, 10);
  return isNaN(seconds) ? undefined : seconds;
}

/**
 * Type guards for exceptions
 */
export function isNetworkError(error: any): error is NetworkException {
  return error instanceof NetworkException;
}

export function isTimeoutError(error: any): error is TimeoutException {
  return error instanceof TimeoutException;
}

export function isUnauthorizedError(error: any): error is UnauthorizedException {
  return error instanceof UnauthorizedException;
}

export function isForbiddenError(error: any): error is ForbiddenException {
  return error instanceof ForbiddenException;
}

export function isNotFoundError(error: any): error is NotFoundException {
  return error instanceof NotFoundException;
}

export function isValidationError(error: any): error is ValidationException {
  return error instanceof ValidationException;
}

export function isConflictError(error: any): error is ConflictException {
  return error instanceof ConflictException;
}

export function isRateLimitError(error: any): error is RateLimitException {
  return error instanceof RateLimitException;
}

export function isServerError(error: any): error is ServerException {
  return error instanceof ServerException;
}

export function isApiException(error: any): error is ApiException {
  return error instanceof ApiException;
}
