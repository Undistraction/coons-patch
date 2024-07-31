// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const isType = (type: string, value: any): boolean => typeof value === type

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const isArray = (value: any): value is Array<any> => Array.isArray(value)

export const isInt = (value: any): value is number => Number.isInteger(value)

export const isNumber = (value: any): value is number =>
  !isNaN(value) && isType('number', value)

export const isUndefined = (value: any): value is undefined =>
  isType('undefined', value)

export const isNull = (value: any): value is null => value === null

export const isNil = (value: any): value is null | undefined =>
  isUndefined(value) || isNull(value)

export const isString = (value: any): value is string =>
  isType('string', value) || value instanceof String

export const isPlainObj = (value: any): value is {} =>
  !isNull(value) && isType('object', value) && value.constructor === Object

export const isFunction = (value: any): value is Function =>
  isType('function', value)
