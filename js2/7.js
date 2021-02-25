/**
 * Replicate Array.prototype.forEach and call it cForEach
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_forEach.asp
 */

const solution = () => {
  const callAllWith = (arr, cb, i = 0) => {
    if (i >= arr.length) return;

    if (arr[i] !== undefined) cb(arr[i], i, arr);

    callAllWith(arr, cb, i + 1);
  };
  Array.prototype.cForEach = function (cb) {
    callAllWith(this, cb);
  };
};

module.exports = {
  solution,
};
