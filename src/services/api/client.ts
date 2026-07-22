const defaultHeaders = { "Content-Type": "application/json" } as const;

export async function apiClient<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, {
    ...init,
    headers: { ...defaultHeaders, ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
