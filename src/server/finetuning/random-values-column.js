/** 
 * @typedef {Object} Option
 * @property {string} name - The name/value to assign to the cell
 * @property {number} count - The number of cells that should have this value
 */

/**
 * Creates a column of random values based on the provided options
 * @param {number} ttlLen - Number of lines to generate
 * @param {Option[]} optionsAr - The options containing the name and the number of properties to generate
 * @returns {Array<Array<string>>} A two-dimensional array representing the column
 */
export function makeRandomValuesColumn(ttlLen, optionsAr) {
  const newAr = new Array(ttlLen).fill(['']);
  optionsAr.forEach(option => {
    for (let i = 0; i < option.count; i++)
      newAr[getEmptyRandom(newAr)] = [option.name];
  });
  // console.warn('DEBUGPRINT[1]: random-values-column.js:7: newAr=', newAr);
  return newAr;
}

/**
 * Generates a random integer between 0 and len-1
 * @param {number} len - The upper bound (exclusive)
 * @returns {number} A random integer
 */
function getRandom(len) {
  return Math.floor(Math.random() * len);
}

/**
 * Finds a random empty position in the array
 * @param {Array<Array<string>>} ar - The array to search in
 * @returns {number} The index of a random empty position
 */
function getEmptyRandom(ar = [[]]) {
  const i = getRandom(ar.length);
  if ('' === ar[i][0]) return i;
  return getEmptyRandom(ar);
}
