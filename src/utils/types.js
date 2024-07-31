// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const isType = (type, value) => typeof value === type

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const isArray = Array.isArray

export const isInt = Number.isInteger

export const isNumber = (value) => !isNaN(value) && isType('number', value)

export const isUndefined = (value) => isType('undefined', value)

export const isNull = (value) => value === null

export const isNil = (value) => isUndefined(value) || isNull(value)

export const isString = (value) =>
  isType('string', value) || value instanceof String

export const isPlainObj = (value) =>
  !isNull(value) && isType('object', value) && value.constructor === Object

export const isFunction = (value) => isType('function', value)
