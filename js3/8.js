/*
 * Write a function that takes in an object and a number (millieseconds).
 * - You must call each function value of the object {"nVal": (k) => {...}}
 * - {"nVal": (k) => {...When this function runs, k is "nVal"...}}
 * @param {object} obj
 * @param {number} num (millieseconds)
 * @call each function value of the object, millieseconds after each other
 */

const solution = (obj, num) => {
  const solutionHelper = (entries, num, i = 0) => {
    if (i >= entries.length) return;

    const [key, cb] = entries[i];
    
    cb(key);
    
    setTimeout(() => {
      solutionHelper(entries, num, i + 1);
    }, num);
  };
  
  solutionHelper(Object.entries(obj), num);
};

module.exports = {
  solution,
};
