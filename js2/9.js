/**
 * Replicate Array.prototype.reduce and call it cReduce
 * Documentation:
 *     Replicate Array.prototype.reduce and call it cReduce
 */

const solution = () => {
  const cReduceHelper = (arr, keys, reducer, i = 0, acc) => {
    if (i >= keys.length) return acc;

    const key = keys[i];
    const cur = arr[key];

    acc = reducer(acc, cur, Number(key), arr);

    return cReduceHelper(arr, keys, reducer, i + 1, acc);
  };

  Array.prototype.cReduce = function (reducer, initialValue) {
    const arr = this;
    const keys = Object.keys(arr);
    const [startIndex, acc] = initialValue
      ? [0, initialValue]
      : [1, arr[keys[0]]];

    return cReduceHelper(arr, keys, reducer, startIndex, acc);
  };
};

module.exports = {
  solution,
};
