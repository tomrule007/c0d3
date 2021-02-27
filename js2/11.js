/**
 * Creates Array.prototype.cFind that has the same functionality as find
 *   If nothing was found, return undefined (which should be default
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */

const solution = () => {
  const cFindHelper = (arr, keys, predicate, i = 0) => {
    if (i >= keys.length) return undefined;

    const key = keys[i];
    const value = arr[key];

    return predicate(value, Number(key), arr)
      ? value
      : cFindHelper(arr, keys, predicate, i + 1);
  };

  Array.prototype.cFind = function (predicate, thisValue) {
    const callback = thisValue ? predicate.bind(thisValue) : predicate;
    return cFindHelper(this, Object.keys(this), callback);
  };
};

module.exports = {
  solution,
};
