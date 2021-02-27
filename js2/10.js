/**
 * Replicate Array.prototype.filter and call it cFilter
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_filter.asp
 */

const solution = () => {
  const cFilterHelper = (arr, keys, predicate, i = 0) => {
    if (i >= keys.length) return [];
    const key = keys[i];
    const value = arr[key];
    return predicate(value, Number(key), arr)
      ? [value, ...cFilterHelper(arr, keys, predicate, i + 1)]
      : cFilterHelper(arr, keys, predicate, i + 1);
  };

  Array.prototype.cFilter = function (predicate, thisValue) {
    const callback = thisValue ? predicate.bind(thisValue) : predicate;
    return cFilterHelper(this, Object.keys(this), callback);
  };
};

module.exports = {
  solution,
};
