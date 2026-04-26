const BASE_URL = "http://localhost:8080"

interface AuthResponse {
  accessToken: string; expiresInSeconds: number;
}

export async function loginWithEmailAndPwd(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {
        email: email,
        password: password
      }
    )
  })

  return await response.json()
}

export async function registerWithEmailAndPwd(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {
        name: name,
        email: email,
        password: password
      }
    )
  })

  return await response.json()
}