import Sentiment from "sentiment";

export const stopwordsRegex =
  /\b(i|me|my|myself|we|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|s|t|can|will|just|don|should|now)\b/i;
export default function SentimentAlyze() {
  const sentiment = new Sentiment();
  function _termFrequency(d: string) {
    const terms = d
      .replace(/[.,?!-]+/g, "")
      .toLowerCase()
      .split(" ");
    let count: { [t: string]: number } = {};
    let tf: { [t: string]: number } = {};
    for (const t of terms) {
      if (stopwordsRegex.test(t)) {
        continue;
      }
      if (!count[t]) {
        count[t] = 1;
        continue;
      }
      count[t] = count[t] + 1;
    }
    Object.entries(count).forEach((v) => {
      tf[v[0]] = Number((v[1] / terms.length).toFixed(3));
    });
    return tf;
  }
  function _idf(d: string[]) {
    if (d.length <= 1) {
      throw new Error("idf requires more than 1 document");
    }
    let df: { [t: string]: number } = {};
    d.forEach((d) => {
      const terms = d
        .replace(/[.,?!-]+/g, "")
        .toLowerCase()
        .split(" ");
      const seen: { [t: string]: boolean } = {};
      for (const t of terms) {
        if (stopwordsRegex.test(t)) {
          continue;
        }
        if (df[t] && !seen[t]) {
          df[t] = df[t] + 1;
        }
        if (!df[t]) {
          df[t] = 1;
          continue;
        }
        seen[t] = true;
      }
    });
    let idf: { [t: string]: number } = {};
    Object.entries(df).forEach((v) => {
      idf[v[0]] = Number(Math.log10(d.length / v[1]).toFixed(3));
    });
    return idf;
  }
  function _tfidf(d: string[]) {
    if (d.length <= 1) {
      throw new Error("tfidf requires more than 1 document");
    }
    let tfIDF: { [t: string]: number[] } = {};
    const idf = _idf(d);
    d.forEach((d) => {
      const tf = _termFrequency(d);
      Object.entries(idf).forEach(([t, f]) => {
        let vector = tfIDF[t] || [];
        vector.push(Number((f * tf[t]).toFixed(3)) || 0);
        tfIDF[t] = vector;
      });
    });

    return tfIDF;
  }
  return {
    termFrequency: _termFrequency,
    idf: _idf,
    tfidf: _tfidf,
    analyze: sentiment.analyze,
  };
}
