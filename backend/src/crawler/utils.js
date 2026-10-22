export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export function isInternalLink(baseUrl, targetUrl) {
  try {
    const base = new URL(baseUrl);
    const target = new URL(targetUrl);
    return base.hostname === target.hostname;
  } catch {
    return false;
  }
}

export function absoluteUrl(base, relative) {
  try {
    return new URL(relative, base).toString();
  } catch {
    return null;
  }
}

export function sanitizeUrl(url) {
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    u.search = ""; // remove ?query
    u.hash = "";   // remove #fragment
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}
