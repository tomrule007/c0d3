/*
 * 2sum: write a function that takes in an array of numbers and a number, and returns true if any pairs add up to the number.
 * (The numbers in the array is not unique, meaning there may be duplicate numbers)
 * @param {array} arr
 * @param {number} num
 * @returns {boolean}
 */

const solution = (arr, num) => {
  const seenNumbers = new Set();

  return arr.some((value) => {
    if (seenNumbers.has(num - value)) return true;

    seenNumbers.add(value);

    return false;
  });
};

module.exports = {
  solution,
};
