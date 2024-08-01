import {
  ExpandedSteps,
  Step,
  Steps,
  UnprocessedStep,
  UnprocessedSteps,
} from '../types'
import { times } from './functional'
import { isInt, isPlainObj } from './is'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const addAllReducer = (total: number, step: Step) => total + step.value

const addAll = (steps: Steps) => steps.reduce(addAllReducer, 0)

const getCounts = (columns: Steps, rows: Steps) => ({
  columnsTotalCount: columns.length,
  rowsTotalCount: rows.length,
})

const getTotalValues = (columns: Steps, rows: Steps) => ({
  columnsTotalValue: addAll(columns),
  rowsTotalValue: addAll(rows),
})

const ensureArray = (unprocessedSteps: UnprocessedSteps): ExpandedSteps => {
  if (isInt(unprocessedSteps)) {
    return times(() => 1, unprocessedSteps)
  }
  return unprocessedSteps
}

const ensureObjects = (steps: ExpandedSteps): Steps =>
  steps.map((step: UnprocessedStep) => {
    if (isPlainObj(step)) {
      return step as Step
    } else {
      return {
        value: step,
      }
    }
  })

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const getTSize = (
  steps: Steps,
  idx: number,
  totalValue: number
): number => {
  const step = steps[idx]
  const stepValue = step.value
  return stepValue / totalValue
}

export const processSteps = (steps: UnprocessedSteps): Steps => {
  const arrayOfSteps = ensureArray(steps)
  return ensureObjects(arrayOfSteps)
}

export const getStepData = (
  columns: UnprocessedSteps,
  rows: UnprocessedSteps
) => {
  const [processedColumns, processedRows] = [columns, rows].map(processSteps)
  return {
    ...getCounts(processedColumns, processedRows),
    ...getTotalValues(processedColumns, processedRows),
    processedColumns,
    processedRows,
  }
}
