import { toast } from "sonner";

type FetchOptions = RequestInit & {
  useCache?: boolean; // default true for GET
  cacheTTL?: number; // milliseconds
  suppressToast?: boolean;
};

const fetchCache = new Map<string, { expiry: number; data: any }>();
const DEFAULT_TTL = 60 * 1000; // 60s

const getKey = (input: RequestInfo, init?: RequestInit) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof Request
      ? input.url
      : String(input);
  const body = init?.body
    ? typeof init.body === "string"
      ? init.body
      : JSON.stringify(init.body)
    : "";
  const params = init?.method ? init.method.toUpperCase() : "GET";
  return `${params}:${url}:${body}`;
};

export async function fetchWithToast(
  input: RequestInfo,
  init?: FetchOptions
): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const useCache = init?.useCache ?? method === "GET";
  const ttl = init?.cacheTTL ?? DEFAULT_TTL;
  const suppress = init?.suppressToast ?? false;

  const key = getKey(input, init);
  if (method === "GET" && useCache) {
    const entry = fetchCache.get(key);
    if (entry && entry.expiry > Date.now()) {
      // create a lightweight Response-like object with json() available
      const body = JSON.stringify(entry.data);
      const cachedResponse = new Response(body, {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/json" },
      });
      return cachedResponse;
    }
  }

  try {
    const response = await fetch(input, init as RequestInit);

    // try to read JSON for caching and toast message extraction
    let data: any = null;
    try {
      data = await response.clone().json();
    } catch (e) {
      // not JSON or empty
    }

    if (response.ok) {
      if (!suppress && method !== "GET") {
        // backend may put message under data.data.message
        const message =
          data?.data?.message ||
          data?.message ||
          data?.msg ||
          "Request successful";
        toast.success(String(message));
      }

      if (method === "GET" && useCache && data !== null) {
        fetchCache.set(key, { expiry: Date.now() + ttl, data });
      }
    } else {
      if (!suppress) {
        const message =
          data?.data?.message ||
          data?.message ||
          data?.msg ||
          response.statusText ||
          "Request failed";
        toast.error(String(message));
      }
    }

    return response;
  } catch (error: any) {
    if (!suppress) {
      toast.error(error?.message || "Network error");
    }
    throw error;
  }
}

export default fetchWithToast;
