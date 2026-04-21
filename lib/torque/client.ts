// Torque base REST client
// Auth: Authorization: Bearer <TORQUE_API_TOKEN>

const TORQUE_BASE_URL =
  process.env.TORQUE_BASE_URL ?? "https://api.torque.so";

export class TorqueError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "TorqueError";
  }
}

async function torqueFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = process.env.TORQUE_API_TOKEN;
  if (!token) {
    throw new TorqueError(
      401,
      "TORQUE_API_TOKEN is not set. Add it to .env.local.",
    );
  }

  const url = `${TORQUE_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Torque API error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore parse error
    }
    throw new TorqueError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export const torqueClient = {
  get: <T>(path: string) => torqueFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    torqueFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body: unknown) =>
    torqueFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) => torqueFetch<T>(path, { method: "DELETE" }),
};
