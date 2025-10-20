// File: lib/fetchWithToken.ts
export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Not logged in or token missing");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // ✅ 默认加上，避免部分接口报错
    },
  });
}
