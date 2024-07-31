// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

import { times } from './functional'
import { isInt } from './types'

const addAll = (list) => list.reduce((total, { value }) => total + value, 0)

const getCounts = (columns, rows) => ({
  columnsTotalCount: columns.length,
  rowsTotalCount: rows.length,
})

const getTotalValues = (columns, rows) => ({
  columnsTotalValue: addAll(columns),
  rowsTotalValue: addAll(rows),
})

const expandToSteps = (stepCountOrArray) => {
  if (isInt(stepCountOrArray)) {
    return times(stepCountOrArray, () => stepCountOrArray)
  }
  return stepCountOrArray
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const getTSize = (steps, idx, totalValue) => {
  const step = steps[idx]
  const stepValue = step.value || step
  return stepValue / totalValue
}

export const getStepData = (...args) => {
  const [columns, rows] = args.map(expandToSteps)
  return {
    ...getCounts(columns, rows),
    ...getTotalValues(columns, rows),
  }
}
