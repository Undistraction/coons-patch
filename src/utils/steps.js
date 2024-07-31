// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

import { times } from './functional'
import { isInt, isPlainObj } from './types'

const addAll = (list) => list.reduce((total, step) => total + step.value, 0)

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
    return times(() => stepCountOrArray, stepCountOrArray)
  }
  return stepCountOrArray
}

const convertToObjects = (steps) =>
  steps.map((step) => {
    if (isPlainObj(step)) {
      return step
    } else {
      return {
        value: step,
      }
    }
  })

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const getTSize = (steps, idx, totalValue) => {
  const step = steps[idx]
  const stepValue = step.value || step
  return stepValue / totalValue
}

export const processSteps = (steps) => {
  const arrayOfSteps = expandToSteps(steps)
  return convertToObjects(arrayOfSteps)
}

export const getStepData = (columns, rows) => {
  const [processedColumns, processedRows] = [columns, rows].map(processSteps)
  return {
    ...getCounts(processedColumns, processedRows),
    ...getTotalValues(processedColumns, processedRows),
    processedColumns,
    processedRows,
  }
}
