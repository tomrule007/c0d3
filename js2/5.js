/**
 * Write a function called solution that
 *   Takes in an array of functions and a number,
 *   and calls every function input milliseconds later
 * @param {array} arr
 * @param {number} time
 */

const solution = (arr, time) => {
  const solutionHelper = (arr, i = 0) => {
    if (i >= arr.length) return;
    arr[i]();
    solutionHelper(arr, i + 1);
  };

  setTimeout(() => {
    solutionHelper(arr);
  }, time);
};

module.exports = {
  solution,
};
