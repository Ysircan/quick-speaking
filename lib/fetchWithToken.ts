// File: lib/fetchWithToken.ts

export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('未登录或 token 缺失')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
