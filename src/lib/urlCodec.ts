const B64_PREFIX = "b64:";

function utf8ToBase64url(str: string): string {
  const binary = unescape(encodeURIComponent(str));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToUtf8(encoded: string): string {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return decodeURIComponent(escape(atob(base64)));
}

export function encodeCode(code: string): string {
  if (code === "") return "";
  return B64_PREFIX + utf8ToBase64url(code);
}

export function decodeCode(encoded: string): string {
  if (encoded.startsWith(B64_PREFIX)) {
    try {
      return base64urlToUtf8(encoded.slice(B64_PREFIX.length));
    } catch {
      // Fall through to legacy decode
    }
  }
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}
