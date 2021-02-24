/**
 * write a function called solution that takes in an array of strings and returns a function.
 * when the returned function is called (with an object with many keys),
 * it will return an object with only keys that exist in the input array.
 * @param {array} arr
 * @return {function} object -> object
 */

const solution = (arr) => {
  return (obj) =>
    Object.fromEntries(
      arr.map((key) => (obj.hasOwnProperty(key) ? [key, obj[key]] : []))
    );
};

module.exports = {
  solution,
};
