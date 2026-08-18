import { apiClient, USE_MOCKS } from '../api/client';

/**
 * Fetches data from a backend endpoint.
 * Throws on failure — React Query catches and surfaces isError.
 * When USE_MOCKS=true, throws with a clear message so error states appear.
 */
export async function getBackend<T>(url: string): Promise<T> {
  if (USE_MOCKS) {
    throw new Error(
      `[RootPilot] Mock mode is active. Set VITE_USE_MOCKS=false in .env to connect to the real backend at ${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}.`,
    );
  }
  const { data } = await apiClient.get<T>(url);
  return data;
}

/**
 * Posts JSON data to a backend endpoint and returns the response.
 */
export async function postBackend<T>(url: string, body: unknown): Promise<T> {
  if (USE_MOCKS) {
    throw new Error(
      `[RootPilot] Mock mode is active. Set VITE_USE_MOCKS=false in .env.`,
    );
  }
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
