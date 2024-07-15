import { Bezier } from 'bezier-js'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const DEFAULT_PRECISION = 1000

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const getCoordinatesFromSlashedString = (pair) =>
  pair.split('/').map((v) => parseFloat(v))

const validateRatio = (ratio) => {
  if (ratio < 0 || ratio > 1) {
    throw new Error(`Ratio must be between 0 and 1, but was '${ratio}'`)
  }
}

const pointsAreEqual = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y
}

const getDistanceBetweenPoints = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  )
}

const getInterpolatedPointsOnCurve = (curve, precision) => {
  const points = []

  for (let i = 0; i <= precision; i++) {
    const ratio = i / precision
    points.push(getInterpolatedPointOnCurve(ratio, curve))
  }

  return points
}

const getCumulativeLengths = (pointsApproximate) => {
  const cumulativeLengths = [0]
  for (let i = 1; i < pointsApproximate.length; i++) {
    // Find distance between current and previous approximate points
    const lastApproximatePoint = pointsApproximate[i - 1]
    const thisApproximatePoint = pointsApproximate[i]
    const distance = getDistanceBetweenPoints(
      lastApproximatePoint,
      thisApproximatePoint
    )

    // Add the next cummulative length
    const lastCummulativeLength = cumulativeLengths[i - 1]
    cumulativeLengths.push(lastCummulativeLength + distance)
  }

  return cumulativeLengths
}

const findClosestPointOnCurve = (
  cumulativeLengths,
  curve,
  targetLength,
  precision
) => {
  let point = null
  for (let j = 1; j < cumulativeLengths.length; j++) {
    if (cumulativeLengths[j] >= targetLength) {
      const ratio =
        (j -
          1 +
          (targetLength - cumulativeLengths[j - 1]) /
            (cumulativeLengths[j] - cumulativeLengths[j - 1])) /
        precision
      point = getInterpolatedPointOnCurve(ratio, curve)
      break
    }
  }
  return point
}

export const getDeltasBetweenPoints = (point1, point2) => {
  const deltaX = point1.x - point2.x
  const deltaY = point1.y - point2.y
  return { deltaX, deltaY }
}

const interpolateBetweenPoints = (range, point1, point2) => {
  const { deltaX, deltaY } = getDeltasBetweenPoints(point2, point1)

  return {
    x: point1.x + range * deltaX,
    y: point1.y + range * deltaY,
  }
}

const interpolateControlPoints = (ratio, curve1, curve2) => {
  return {
    controlPoint1: interpolateBetweenPoints(
      ratio,
      curve1.controlPoint1,
      curve2.controlPoint1
    ),
    controlPoint2: interpolateBetweenPoints(
      ratio,
      curve1.controlPoint2,
      curve2.controlPoint2
    ),
  }
}

export const getBezier = (curve) => {
  return new Bezier(...getCurvePropsAsArray(curve))
}

export const getCurveFromArray = ([
  startPoint,
  controlPoint1,
  controlPoint2,
  endPoint,
]) => ({
  startPoint,
  controlPoint1,
  controlPoint2,
  endPoint,
})

export const getSubcurveBetweenRatios = (curve, ratioStart, ratioEnd) => {
  const startPoint = getInterpolatedPointOnCurve(ratioStart, curve)
  const endPoint = getInterpolatedPointOnCurve(ratioEnd, curve)

  return getBezier(curve).split(startPoint.ratio, endPoint.ratio)
}

export const getIntersectionBetweenCurves = (curve1, curve2) => {
  const curve1Bezier = getBezier(curve1)
  const curve2Bezier = getBezier(curve2)
  let results = curve1Bezier
    .intersects(curve2Bezier)
    .map((coordinateString) => {
      const [x] = getCoordinatesFromSlashedString(coordinateString)
      const result = curve1Bezier.get(x)

      const r = {
        x: result.x,
        y: result.y,
        ratio: result.t,
      }
      return r
    })

  if (pointsAreEqual(curve1.startPoint, curve2.startPoint)) {
    results = [{ ...curve1.startPoint, ratio: 0 }, ...results]
  } else if (pointsAreEqual(curve1.startPoint, curve2.endPoint)) {
    results = [{ ...curve1.startPoint, ratio: 0 }, ...results]
  } else if (pointsAreEqual(curve1.endPoint, curve2.endPoint)) {
    results = [...results, { ...curve1.endPoint, ratio: 1 }]
  } else if (pointsAreEqual(curve1.endPoint, curve2.startPoint)) {
    results = [...results, { ...curve1.endPoint, ratio: 1 }]
  }

  return results
}

const getIntersectionWithCurveSet = (curve, curvesToCheck) => {
  return curvesToCheck.reduce((acc, intersectionCurve) => {
    const points = getIntersectionBetweenCurves(curve, intersectionCurve)

    return [...acc, ...points]
  }, [])
}

const getCurvePropsAsArray = (curve) => {
  return [
    curve.startPoint.x,
    curve.startPoint.y,
    curve.controlPoint1.x,
    curve.controlPoint1.y,
    curve.controlPoint2.x,
    curve.controlPoint2.y,
    curve.endPoint.x,
    curve.endPoint.y,
  ]
}

const getCornerPoints = (x, y, width, height) => {
  const rightBounds = x + width
  const bottomBounds = y + height

  return {
    topLeft: { x, y },
    topRight: { x: rightBounds, y },
    bottomRight: { x: rightBounds, y: bottomBounds },
    bottomLeft: { x, y: bottomBounds },
  }
}

const getInterpolatedAxis = (
  axis,
  ratio,
  { controlPoint1, controlPoint2, startPoint, endPoint }
) => {
  return (
    Math.pow(1 - ratio, 3) * startPoint[axis] +
    3 * ratio * Math.pow(1 - ratio, 2) * controlPoint1[axis] +
    3 * ratio * ratio * (1 - ratio) * controlPoint2[axis] +
    ratio * ratio * ratio * endPoint[axis]
  )
}

const getInterpolatedPointOnCurve = (ratio, curve) => {
  return {
    x: getInterpolatedAxis('x', ratio, curve),
    y: getInterpolatedAxis('y', ratio, curve),
    ratio,
  }
}

export const getInterpolatedPointsOnCurveEvenlyDistributed = (
  ratio,
  curve,
  // Get an approximation using an arbitrary number of points. Increase for more
  // accuracy at cost of performance
  { precision = DEFAULT_PRECISION } = {}
) => {
  // Approximate the curve with a high number of points
  const pointsApproximate = getInterpolatedPointsOnCurve(curve, precision)

  // Calculate the cumulative arc length
  const cumulativeLengths = getCumulativeLengths(pointsApproximate)

  const totalLength = cumulativeLengths[cumulativeLengths.length - 1]
  const targetLength = ratio * totalLength

  // Interpolate new point based on the cumulative arc length
  const point = findClosestPointOnCurve(
    cumulativeLengths,
    curve,
    targetLength,
    precision
  )

  return point
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export const isArray = Array.isArray
export const isInt = Number.isInteger
export const isUndefined = (value) => typeof value === 'undefined'
export const isNull = (value) => value === null
export const isNil = (value) => isUndefined(value) || isNull(value)

export const getBoundingCurvesFromBounds = ({ x, y, width, height }) => {
  const corners = getCornerPoints(x, y, width, height)

  const topLeftOffset = Math.random() * 500 - 250

  corners.topLeft.x = corners.topLeft.x + topLeftOffset

  const boundingCurves = {
    top: {
      startPoint: corners.topLeft,
      endPoint: corners.topRight,
    },
    right: {
      startPoint: corners.topRight,
      endPoint: corners.bottomRight,
    },
    bottom: {
      startPoint: corners.bottomLeft,
      endPoint: corners.bottomRight,
    },
    left: {
      startPoint: corners.topLeft,
      endPoint: corners.bottomLeft,
    },
  }

  return boundingCurves
}

export const getIntersectionsBetweenCurveSets = ({
  curvesFromLeftToRight,
  curvesFromTopToBottom,
}) => {
  return curvesFromLeftToRight.reduce((acc, curve) => {
    const points = getIntersectionWithCurveSet(curve, curvesFromTopToBottom)
    return [...acc, ...points]
  }, [])
}

export const interpolatCurve = (
  ratio,
  { curve1, curve2 },
  { curve3, curve4 }
) => {
  validateRatio(ratio)

  // Use ratio to find a point on the first curve which will be the starting
  // point of our curve.
  const startPoint = getInterpolatedPointsOnCurveEvenlyDistributed(
    ratio,
    curve1
  )

  // Use ratio to find a point on the opposite curve which will be the ending
  // point of our curve.
  const endPoint = getInterpolatedPointsOnCurveEvenlyDistributed(ratio, curve2)

  // Get a curve that is interpolated between our start and end points
  const { controlPoint1, controlPoint2 } = interpolateControlPoints(
    endPoint.ratio,
    curve3,
    curve4
  )

  return {
    startPoint,
    endPoint,
    controlPoint1,
    controlPoint2,
  }
}
