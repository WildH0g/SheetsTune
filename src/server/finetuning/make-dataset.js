export function makeDataset(twoDimArr) {
  const headers = twoDimArr.shift();
  const objAr = twoDimArr.map(row =>
    row.map((value, i) => ({ role: headers[i], parts: [{ text: value }] }))
  );
  return objAr
    .map(row => JSON.stringify({ contents: [row[0], row[1]] }))
    .join('\n');
}
