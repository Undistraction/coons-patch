import React from 'react'
import Draggable from 'react-draggable'

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const WIDTH = 20
const HEIGHT = 20

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

const CornerNode = ({ id, position, onDrag }) => {
  const nodeRef = React.useRef(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      bounds="#patch-view"
      onDrag={(event, dragElement) => onDrag(event, dragElement, id)}
      onStop={(event, dragElement) => onDrag(event, dragElement, id)}
      handle=".corner-handle"
    >
      <div
        className="corner-handle group absolute -left-[10px] -top-[10px]"
        ref={nodeRef}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
          viewBox={`${-WIDTH * 0.5} ${-HEIGHT * 0.5}  ${WIDTH} ${HEIGHT}`}
          width={`${WIDTH}px`}
          height={`${HEIGHT}px`}
          className="scale-1 transition-transform hover:scale-125 group-[.react-draggable-dragging]:scale-125"
        >
          <circle
            stroke="black"
            strokeWidth="3"
            fill="white"
            cx="0"
            cy="0"
            r={WIDTH * 0.5}
          />
          <circle
            fill="black"
            cx="0.25"
            cy="0.25"
            r={WIDTH * 0.25}
          />
        </svg>
      </div>
    </Draggable>
  )
}

export default CornerNode
