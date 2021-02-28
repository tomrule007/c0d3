/* global describe it expect */

const solution = require('../11').solution
solution()

describe('test cFind', () => {
  it('should run callbacks like a map function, with 3 parameters', () => {
    let callbacks;
    [9].cFind((e, i, arr) => {
      callbacks = [e, i]
    })
    expect(callbacks).toEqual([9, 0])
  })
  it('should find the first number', () => {
    const a = [9, 2, 3]
    const result = a.cFind((e) => e === 9)
    expect(result).toEqual(9)
  })
  it('should find middle string', () => {
    const a = ['abc', 'dd', 'abc']
    const result = a.cFind((e) => e === 'dd')
    expect(result).toEqual('dd')
  })
  it('should find last string', () => {
    const a = ['abc', 'dd', 'abc', 'defg']
    const result = a.cFind((e) => e === 'defg')
    expect(result).toEqual('defg')
  })
  it('should return undefined', () => {
    const a = ['abc', 'dd', 'abc', 'defg']
    const result = a.cFind((e) => e === 'defgh')
    expect(result + '').toEqual('undefined')
  })
  describe('Bonus Round', () => {
    it('index value provided to callback is a number value (not a string)', () => {
      let index;
      [9].cFind((e, i, arr) => {
        index = i
      })
      expect(typeof index).toBe("number")
    })
    it("callback should bind to optional 'thisValue' if provided", () => {
      const thisValue = {test:2}
      const a = [1,2, 3]
      const c = a.cFind(function (x) {
        return this.test == x},thisValue)
      expect(c).toEqual(2)
    })
  })
})
