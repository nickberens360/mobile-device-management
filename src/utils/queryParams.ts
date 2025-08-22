import type { LocationQuery } from 'vue-router';

/**
 * Safely extracts a string parameter from Vue Router query object
 */
export function getStringParam(query: LocationQuery, key: string): string | null {
  const value = query[key];
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return null;
}

/**
 * Safely extracts a boolean parameter from Vue Router query object
 */
export function getBooleanParam(query: LocationQuery, key: string): boolean | null {
  const value = getStringParam(query, key);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

/**
 * Safely extracts a number parameter from Vue Router query object
 */
export function getNumberParam(query: LocationQuery, key: string): number | null {
  const value = getStringParam(query, key);
  if (value === null) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Safely checks if a specific string value exists in query params
 */
export function hasQueryValue(query: LocationQuery, key: string, expectedValue: string): boolean {
  const value = getStringParam(query, key);
  return value === expectedValue;
}