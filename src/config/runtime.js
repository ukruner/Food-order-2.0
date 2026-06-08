const rawApiBase =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

export const API_BASE_URL = rawApiBase.replace(/\/$/, "");
export const IS_STATIC_HOST = API_BASE_URL.length === 0;

export function apiUrl(path) {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function assetUrl(path) {
  if (API_BASE_URL) {
    return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
