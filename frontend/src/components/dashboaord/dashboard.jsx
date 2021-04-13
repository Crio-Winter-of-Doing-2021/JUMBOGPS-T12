// import React from 'react';
import ReactDOM from "react-dom";
import styles from "./styles.module.css";

// class Dashboard extends React.Component{

//     state = {
//         pos: this.props.initialPos,
//         dragging: false,
//         rel: null // position relative to the cursor
//     }

//     componentDidUpdate(props,state){
//         if (this.state.dragging && !state.dragging) {
//             document.addEventListener('mousemove', this.onMouseMove)
//             document.addEventListener('mouseup', this.onMouseUp)
//           } else if (!this.state.dragging && state.dragging) {
//             document.removeEventListener('mousemove', this.onMouseMove)
//             document.removeEventListener('mouseup', this.onMouseUp)
//           }
//     }

//     onMouseDown = (e)=>{

//         if (e.button !== 0) return
//         // var computedStyle = window.getComputedStyle(ReactDOM.findDOMNode);
//         // var pos = $(this.getDOMNode()).offset()
//         var pos = ReactDOM.findDOMNode().getBoundingClientRect();
//         this.setState({
//           dragging: true,
//           rel: {
//             x: e.pageX - pos.left,
//             y: e.pageY - pos.top
//           }
//         })
//         e.stopPropagation()
//         e.preventDefault()

//     }

//     onMouseUp = (e)=>{
//         this.setState({dragging: false})
//         e.stopPropagation()
//         e.preventDefault()
//     }

//     onMouseMove = (e)=>{
//         if (!this.state.dragging) return
//         this.setState({
//           pos: {
//             x: e.pageX - this.state.rel.x,
//             y: e.pageY - this.state.rel.y
//           }
//         })
//         e.stopPropagation()
//         e.preventDefault()
//     }
//     render(){
//         return(
//             <div onMouseDown={this.onMouseDown} style={{left: this.state.pos.x + 'px',top: this.state.pos.y + 'px'}}>
//                 {this.props.children}
//             </div>
//         )
//     }
// }

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Dashboard(props) {
  const {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onDragMove,
    children,
    style,
    className,
  } = props;

  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);

    onPointerDown(e);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);

    onPointerUp(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) onDragMove(e);

    onPointerMove(e);
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  console.log(styles.dashboard);
  return (
    <div
      className={styles.dashboard}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}

const { func, element, shape, bool, string } = PropTypes;

Dashboard.propTypes = {
  onDragMove: func.isRequired,
  onPointerDown: func,
  onPointerUp: func,
  onPointerMove: func,
  children: element,
  style: shape({}),
  className: string,
};

Dashboard.defaultProps = {
  onPointerDown: () => {},
  onPointerUp: () => {},
  onPointerMove: () => {},
};
