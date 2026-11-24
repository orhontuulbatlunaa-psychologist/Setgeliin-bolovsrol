function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase серверийн тохиргоо дутуу байна.");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = getConfig();
  const target = path.startsWith("http") ? path : `${url}/rest/v1/${path.replace(/^\//, "")}`;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
    ...(options.headers || {})
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.prefer) headers.Prefer = options.prefer;

  const response = await fetch(target, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 500) }; }
  }
  if (!response.ok) {
    const err = new Error(data?.message || data?.hint || `Supabase хүсэлт алдаа: ${response.status}`);
    err.statusCode = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

module.exports = { supabaseRequest };
