/*
 * Given object of key: string values and an object of key: function values, call the functions in 2nd object, using the values in 1st object as function params
 * @param {object} obj1
 * @param {object} obj2
 * @return {object}
 **/

const solution = (obj1, obj2) => {
  return Object.fromEntries(
    Object.entries(obj1).map(([key, value]) => [
      key,
      obj2[key] ? obj2[key](value) : value,
    ])
  );
};
module.exports = {
  solution,
};
