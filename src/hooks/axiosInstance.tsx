import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

// Simple in-memory cache for GET responses
type CacheEntry = { expiry: number; data: any };
const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 60 * 1000; // 60 seconds

const getCacheKey = (config: AxiosRequestConfig) => {
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  return `${config.baseURL || ""}${url}?${params}`;
};

// We'll implement caching via interceptors rather than replacing axios adapter
// because some bundlers/environments may not expose axios.defaults.adapter.
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: if a GET and cache hit, set a per-request adapter that returns cached response
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const method = (config.method || "").toLowerCase();
    const useCacheHeader = config.headers?.["x-use-cache"];
    const useCache =
      useCacheHeader === undefined
        ? true
        : useCacheHeader === true || useCacheHeader === "true";

    if (method === "get" && useCache) {
      const key = getCacheKey(config);
      const entry = cache.get(key);
      if (entry && entry.expiry > Date.now()) {
        // Provide a per-request adapter that returns the cached response
        (config as any).adapter = async () => {
          const cachedResponse: AxiosResponse = {
            data: entry.data,
            status: 200,
            statusText: "OK",
            headers: (config.headers as any) || {},
            config: config as any,
            request: {} as any,
          };
          return cachedResponse;
        };
      }
    }
  } catch (e) {
    // swallow
  }
  return config;
});

// Response interceptor will cache GET responses when they come from network,
// and will also show toasts for success/errors (see below for error handling).
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const method = (response.config.method || "").toLowerCase();
      if (method === "get" && response && response.data) {
        const key = getCacheKey(response.config);
        const ttlHeader = response.config.headers?.["x-cache-ttl"];
        const ttl = ttlHeader ? Number(ttlHeader) : DEFAULT_TTL;
        cache.set(key, { expiry: Date.now() + ttl, data: response.data });
      }
    } catch (e) {
      // swallow
    }

    return response;
  },
  (error) => {
    // Let the error handler below handle toast display and rejection
    return Promise.reject(error);
  }
);

// Response interceptor: show toasts for success and errors
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      // Allow callers to suppress toasts per-request
      const suppress = response.config.headers?.["x-suppress-toast"];
      const method = (response.config.method || "").toLowerCase();
      // By default: show success for non-GET requests to avoid noise
      if (!suppress && method !== "get") {
        // Backend may return message inside data.data.message
        const msg =
          response.data?.data?.message ||
          response.data?.message ||
          response.data?.msg ||
          "Request successful";
        toast.success(String(msg));
      }
    } catch (e) {
      // swallow
    }
    return response;
  },
  (error) => {
    try {
      const resp = error?.response;
      const config = resp?.config || error?.config || {};
      const suppress = config.headers?.["x-suppress-toast"];
      if (!suppress) {
        // Backend may send error inside response.data.data.message
        const message =
          resp?.data?.data?.message ||
          resp?.data?.message ||
          error.message ||
          "Request failed";
        toast.error(String(message));
      }
    } catch (e) {
      // swallow
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
