const BASE_URL = "http://localhost:7000";
const TOKEN_KEY = "token";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const request = async (path, options = {}) => {
  const {
    method = "GET",
    body,
    token = getStoredToken(),
    headers = {},
    auth = false,
  } = options;

  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
