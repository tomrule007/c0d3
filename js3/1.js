/**
 * given arr of strings (keys) and an object, return an array of values.
 * @param {array} arr {object} obj
 * @returns {array} arr
 */

const solution = (arr, obj) =>
  arr.reduce(
    (acc, curKey) => (obj.hasOwnProperty(curKey) ? [...acc, obj[curKey]] : acc),
    []
  );

module.exports = {
  solution,
};
