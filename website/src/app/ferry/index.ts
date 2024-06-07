const cache: { [key: string]: any } = {};

export default async function ferry<T>(
  uri: string,
  init?: RequestInit
): Promise<T> {
  if (cache[uri]) {
    return Promise.resolve(cache[uri]);
  }
  const res = await fetch(uri, init);
  if (!res.ok) {
    throw new Error(`unable to fetch: ${res.status} - ${res.statusText}`);
  }
  const json = await res.json();
  cache[uri] = json;
  return Promise.resolve(json);
}
