function parseFilterValue(field, op, value, appendToTerm) {
  const res = `${field}${op}${value}`;
  if (appendToTerm === undefined) {
    return res;
  } else {
    return res + appendToTerm;
  }
}

function makePFV(field, op, appendToTerm) {
  return (value) => parseFilterValue(field, op, value, appendToTerm);
}

export { makePFV };
