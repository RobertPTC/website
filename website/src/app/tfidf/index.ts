export default function TFIDF() {
  function _termFrequency(d: string) {
    const terms = d
      .replace(/[.,?!-]+/g, "")
      .toLowerCase()
      .split(" ");
    let count: { [t: string]: number } = {};
    let tf: { [t: string]: number } = {};
    for (const t of terms) {
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
    let df: { [t: string]: number } = {};
    d.forEach((d, i) => {
      const terms = d
        .replace(/[.,?!-]+/g, "")
        .toLowerCase()
        .split(" ");
      const seen: { [t: string]: boolean } = {};
      for (const t of terms) {
        if (!df[t]) {
          df[t] = 1;
          seen[t] = true;
          continue;
        }
        if (df[t] && !seen[t]) {
          df[t] = df[t] + 1;
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
    let tfIDF: { [t: string]: number[] } = {};
    const idf = _idf(d);
    d.forEach((d) => {
      const tf = _termFrequency(d);
      Object.entries(idf).forEach(([t, f]) => {
        let vector = tfIDF[t] || [];
        vector.push(f * tf[t] || 0);
        tfIDF[t] = vector;
      });
    });

    return tfIDF;
  }
  return {
    termFrequency: _termFrequency,
    idf: _idf,
    tfidf: _tfidf,
  };
}
