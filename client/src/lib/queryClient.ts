import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// For GET requests with a single URL parameter
export async function apiRequest<T = unknown>(url: string): Promise<T>;
// For other methods with method, URL, and optional data
export async function apiRequest<T = unknown>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T>;

// Implementation that handles both overloads
export async function apiRequest<T = unknown>(
  methodOrUrl: string,
  urlOrData?: string | unknown,
  data?: unknown
): Promise<T> {
  let method: string;
  let url: string;
  let requestData: unknown | undefined;

  // Handle overloads
  if (urlOrData === undefined) {
    // First overload: only URL provided
    method = 'GET';
    url = methodOrUrl;
    requestData = undefined;
  } else if (typeof urlOrData === 'string') {
    // Second overload: method, URL, and optional data provided
    method = methodOrUrl;
    url = urlOrData;
    requestData = data;
  } else {
    throw new Error('Invalid parameters for apiRequest');
  }

  const res = await fetch(url, {
    method,
    headers: requestData ? { "Content-Type": "application/json" } : {},
    body: requestData ? JSON.stringify(requestData) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
