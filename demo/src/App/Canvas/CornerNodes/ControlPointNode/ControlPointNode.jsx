import React from 'react'
import Draggable from 'react-draggable'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const WIDTH = 12
const HEIGHT = 12

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const ControlPointNode = ({ position, onDrag, id }) => {
  const nodeRef = React.useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      bounds="#patch-view"
      onStop={(event, dragElement) => onDrag(event, dragElement, id)}
      onDrag={(event, dragElement) => onDrag(event, dragElement, id)}
      handle=".control-point-handle"
    >
      <div
        ref={nodeRef}
        className="control-point-handle absolute -left-[6px] -top-[6px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
          viewBox={`${-WIDTH * 0.5} ${-HEIGHT * 0.5} ${WIDTH} ${HEIGHT}`}
          width={`${WIDTH}px`}
          height={`${HEIGHT}px`}
        >
          <circle
            fill="black"
            cx="0"
            cy="0"
            r={WIDTH * 0.5}
          />
        </svg>
      </div>
    </Draggable>
  )
}

export default ControlPointNode
