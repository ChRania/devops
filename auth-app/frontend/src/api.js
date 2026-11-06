export async function post(url, data) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw Object.assign(new Error("Impossible de contacter le serveur."), { errors: {} });
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(body.message || "Une erreur est survenue."), {
      errors: body.errors || {},
    });
  }
  return body;
}
