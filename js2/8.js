/**
 * Replicate Array.prototype.map function and call it cMap
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_map.asp
 */

const solution = () => {
  const cMapHelper = (arr, keys, cb, i = 0, results = []) => {
    if (i >= keys.length) return [];
    const key = keys[i];

    results[key] = cb(arr[key], i, arr);

    cMapHelper(arr, keys, cb, i + 1, results);

    return results;
  };

  Array.prototype.cMap = function (cb) {
    return cMapHelper(this, Object.keys(this), cb);
  };
};

module.exports = {
  solution,
};
