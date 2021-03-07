/**
 * write a function called solution that takes in an array of strings and returns a function.
 * when the returned function is called (with an object with many keys),
 * it will return an object with only keys that exist in the input array.
 * @param {array} arr
 * @return {function} object -> object
 */

const solution = (arr) => {
  return (obj) =>
    arr.reduce((acc, curKey) => {
      return obj.hasOwnProperty(curKey)
        ? { ...acc, [curKey]: obj[curKey] }
        : acc;
    }, {});
};

module.exports = {
  solution,
};
