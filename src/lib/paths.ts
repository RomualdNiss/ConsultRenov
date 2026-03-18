const rawBase = import.meta.env.BASE_URL || "/";

export const basePath = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export function withBase(path: string) {
  if (!path) {
    return basePath;
  }

  if (/^(https?:|mailto:|tel:|#)/.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  return basePath === "/" ? `/${normalizedPath}` : `${basePath}${normalizedPath}`;
}
