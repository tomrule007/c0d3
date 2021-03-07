/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
 */

const solution = (arr) => {
  return [
    ...arr.reduce(
      (acc, num) => {
        if (acc.seen.has(num)) {
          acc.duplicates.add(num);
        } else {
          acc.seen.add(num);
        }
        return acc;
      },
      {
        seen: new Set(),
        duplicates: new Set(),
      }
    ).duplicates,
  ];
};

module.exports = {
  solution,
};
