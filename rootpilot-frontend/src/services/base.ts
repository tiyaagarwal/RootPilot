import { apiClient } from '../api/client';

/**
 * Fetches data from a backend endpoint.
 * Throws on failure — React Query catches and surfaces isError.
 */
export async function getBackend<T>(url: string): Promise<T> {
  const { data } = await apiClient.get<T>(url);
  return data;
}

/**
 * Posts JSON data to a backend endpoint and returns the response.
 */
export async function postBackend<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post<T>(url, body);
  return data;
}

/**
 * @deprecated Use getBackend<T>() directly. The mock parameter is ignored.
 * Kept for backward-compatibility during migration only.
 */
export async function getOrMock<T>(url: string, _mock: T): Promise<T> {
  return getBackend<T>(url);
}
