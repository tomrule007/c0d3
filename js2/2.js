/**
 * Write a function called solution that
 *   Takes in a function and returns an array.
 *
 * As long as the input function returns false,
 *   array keeps growing with the corresponding index value
 * @param {function} fun
 * @returns {array}
 */

const solution = (fun) => {
  const solutionHelper = (fun, i = 0) =>
    fun(i) ? [] : [i, ...solutionHelper(fun, i + 1)];

  return solutionHelper(fun);
};
module.exports = {
  solution,
};
