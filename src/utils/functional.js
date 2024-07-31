// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const times = (callback, n) => {
  let result = []
  for (let i = 0; i < n; i++) {
    result.push(callback(i))
  }
  return result
}

export const timesReduce = (callback, startingValue, n) => {
  let acc = startingValue
  for (let i = 0; i < n; i++) {
    acc = callback(acc, i)
  }
  return acc
}

export const mapObj = (f, o) => {
  return Object.keys(o).reduce((acc, key, idx) => {
    const value = o[key]
    return {
      ...acc,
      [key]: f(value, key, idx),
    }
  }, {})
}
