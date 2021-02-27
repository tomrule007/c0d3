/* global describe it expect */

const solution = require('../8').solution
solution()

describe('test gsMap', () => {
  const cb = (e, i) => {
    return e + i + 1
  }
  it('should run callback with 3 parameters', () => {
    let callbacks;
    [9].cMap((e, i, arr) => {
      callbacks = [e, i, arr]
    })
    expect(callbacks).toEqual([9, 0, [9]])
  })
  it('should not change original array', () => {
    const a = [1, 2, 3]
    a.cMap(cb)
    expect(a).toEqual([1, 2, 3])
  })
  it('should return [] for []', () => {
    expect([].cMap(cb)).toEqual([])
  })
  it('should return new array of 3 elements increased by the value of its index', () => {
    const a = [1, 2, 3]
    const c = a.cMap(cb)
    expect(c).toEqual([2, 4, 6])
  })
  it('should return new array of 3 elements increased by the value of its index twice', () => {
    const a = [1, 2, 3]
    const c = a.cMap(cb).cMap(cb)
    expect(c).toEqual([3, 6, 9])
  })
  describe('Bonus Round', () => {
    it('should preserve spare values', () => {
      const a = [1, , 2, null, 3]
      const c = a.cMap((x) => (x === undefined ? 'undefined' : x))
      expect(c).toEqual(a);
    })

    it("should iterate over 'undefined' and 'null' values ", () => {
      const a = [1, undefined, 2, null, 3]
      const c = a.cMap((x) => x === undefined ? 'undefined' : x === null ? 'null' : x)
      expect(c).toEqual([1, 'undefined', 2, 'null', 3])
    })
  })
})
