/**
 * Write a function called solution that
 *   Takes in 2 numbers and
 *   returns an array with the length equal to the first input number.
 *     Every element in the returned array is an array,
 *        with length equal to  the second input number.
 *     All values in the array is 0.
 * @param {number} row
 * @param {number} col
 * @returns {array}
 */

const solution = (row, col) => {
  const solutionHelper = (length, i = 0, value = 0) => {
    if (i >= length) return [];

    // Make shallow copy of value
    const newValue = Array.isArray(value)
      ? [...value]
      : typeof value === '[Object]' && value !== null
      ? Object.assign({}, value)
      : value;

    return [newValue, ...solutionHelper(length, i + 1, newValue)];
  };

  return solutionHelper(row, 0, solutionHelper(col));
};

module.exports = {
  solution,
};
