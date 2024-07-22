import React from 'react'
import { BOUNDS_POINT_IDS } from '../../../const'
import { getBoundsApi } from '../../../utils/boundsApi'
import NodeEditor from '../NodeEditor'

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const BoundsEditor = ({
  boundingCurves,
  setBoundingCurves,
  config,
  setConfig,
  corners,
  onNodePositionChange,
  onZeroControlPoints,
  onLinkControlPoints,
  onMirrorControlPoints,
}) => {
  const boundsApi = getBoundsApi(boundingCurves, config)

  return (
    <div className="flex flex-col divide-y divide-black border border-black">
      <NodeEditor
        title="Top Left"
        controlNodesAreLinked={
          config.bounds[BOUNDS_POINT_IDS.TOP_LEFT].isLinked
        }
        controlNodesAreMirrored={
          config.bounds[BOUNDS_POINT_IDS.TOP_LEFT].isMirrored
        }
        onNodePositionChange={onNodePositionChange}
        onZeroControlPoints={onZeroControlPoints(BOUNDS_POINT_IDS.TOP_LEFT)}
        onLinkControlPoints={onLinkControlPoints(BOUNDS_POINT_IDS.TOP_LEFT)}
        onMirrorControlPoints={onMirrorControlPoints(BOUNDS_POINT_IDS.TOP_LEFT)}
        {...corners[BOUNDS_POINT_IDS.TOP_LEFT]}
      />
      <NodeEditor
        title="Top right"
        controlNodesAreLinked={
          config.bounds[BOUNDS_POINT_IDS.TOP_RIGHT].isLinked
        }
        controlNodesAreMirrored={
          config.bounds[BOUNDS_POINT_IDS.TOP_RIGHT].isMirrored
        }
        onNodePositionChange={onNodePositionChange}
        onZeroControlPoints={onZeroControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.TOP_RIGHT,
          setBoundingCurves
        )}
        onLinkControlPoints={onLinkControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.TOP_RIGHT,
          setBoundingCurves,
          config,
          setConfig
        )}
        onMirrorControlPoints={onMirrorControlPoints(
          BOUNDS_POINT_IDS.TOP_RIGHT,
          config,
          setConfig
        )}
        {...corners[BOUNDS_POINT_IDS.TOP_RIGHT]}
      />
      <NodeEditor
        title="Bottom left"
        controlNodesAreLinked={
          config.bounds[BOUNDS_POINT_IDS.BOTTOM_LEFT].isLinked
        }
        controlNodesAreMirrored={
          config.bounds[BOUNDS_POINT_IDS.BOTTOM_LEFT].isMirrored
        }
        onNodePositionChange={onNodePositionChange}
        onZeroControlPoints={onZeroControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.BOTTOM_LEFT,
          setBoundingCurves
        )}
        onLinkControlPoints={onLinkControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.BOTTOM_LEFT,
          setBoundingCurves,
          setConfig
        )}
        onMirrorControlPoints={onMirrorControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.BOTTOM_LEFT,
          setConfig
        )}
        {...corners[BOUNDS_POINT_IDS.BOTTOM_LEFT]}
      />
      <NodeEditor
        title="Bottom right"
        controlNodesAreLinked={
          config.bounds[BOUNDS_POINT_IDS.BOTTOM_RIGHT].isLinked
        }
        controlNodesAreMirrored={
          config.bounds[BOUNDS_POINT_IDS.BOTTOM_RIGHT].isMirrored
        }
        onNodePositionChange={onNodePositionChange}
        onZeroControlPoints={onZeroControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.BOTTOM_RIGHT,
          setBoundingCurves
        )}
        onLinkControlPoints={onLinkControlPoints(
          boundsApi,
          BOUNDS_POINT_IDS.BOTTOM_RIGHT,
          setBoundingCurves,
          setConfig
        )}
        onMirrorControlPoints={onMirrorControlPoints(
          BOUNDS_POINT_IDS.BOTTOM_RIGHT,
          config,
          setConfig
        )}
        {...corners[BOUNDS_POINT_IDS.BOTTOM_RIGHT]}
      />
    </div>
  )
}

export default BoundsEditor
