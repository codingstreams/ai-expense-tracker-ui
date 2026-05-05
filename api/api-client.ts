const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken")

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {

    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Something went wrong');
  }

  return response.json();
}