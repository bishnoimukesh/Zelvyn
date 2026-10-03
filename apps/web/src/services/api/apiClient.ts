/**
 * FitSync Universal API Client
 * Connects frontend features to the Express / Mongoose backend.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: `Failed to parse response from ${url}`,
      data: null as unknown as T,
    }));

    if (!res.ok || json.success === false) {
      throw new ApiError(
        json.message || `Request failed with status ${res.status}`,
        res.status
      );
    }

    const payload = json.data !== undefined ? json.data : (json as unknown as T);
    if (payload && typeof payload === "object") {
      if (!("data" in payload)) {
        Object.defineProperty(payload, "data", {
          value: payload,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }
      if ("source" in json && !("source" in payload)) {
        Object.defineProperty(payload, "source", {
          value: (json as any).source,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or CORS error
    throw new ApiError(
      (error as Error).message || "Network error. Please ensure backend is running.",
      0
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) => {
    let finalEndpoint = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "all") {
          searchParams.append(key, String(val));
        }
      });
      const query = searchParams.toString();
      if (query) {
        finalEndpoint += `?${query}`;
      }
    }
    return request<T>(finalEndpoint, { method: "GET" });
  },

  post: <T>(endpoint: string, data?: unknown) => {
    return request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T>(endpoint: string, data?: unknown) => {
    return request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: <T>(endpoint: string) => {
    return request<T>(endpoint, { method: "DELETE" });
  },
};
