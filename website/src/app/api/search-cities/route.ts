import { NextRequest } from "next/server";

import { City } from "app/api/types";
import cities from "app/api/worldcities.json";
import Trie from "trie";

const trie = Trie();
(cities as City[]).map((c) => {
  trie.addWord(c.city, c);
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  if (q) {
    const foundCities = trie.findWords(q);
    return Response.json({ cities: foundCities }, { status: 200 });
  }
  return Response.json({ cities: [] }, { status: 200 });
}
