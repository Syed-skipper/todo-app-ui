const store = new Map();

export function getCached(key, fetcher, ttlMs = 60_000) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) {
    return Promise.resolve(hit.data);
  }
  return fetcher().then((data) => {
    store.set(key, { data, at: Date.now() });
    return data;
  });
}

export function invalidateCache(keyPrefix) {
  if (!keyPrefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) store.delete(key);
  }
}
