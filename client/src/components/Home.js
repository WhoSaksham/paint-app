import React, { useState, useEffect } from 'react'
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  let navigate = useNavigate();
  const { selectedObjects, editor, onReady } = useFabricJSEditor({ defaultStrokeColor: 'red' })
  const [text, setText] = useState("");
  const [strokeColor, setStrokeColor] = useState("");
  const [fillColor, setFillColor] = useState("");

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [])

  const onAddCircle = () => {
    editor?.addCircle()
  }
  const onAddRectangle = () => {
    editor?.addRectangle()
  }
  const onAddLine = () => {
    editor?.addLine()
  }
  const onAddText = () => {
    if (selectedObjects?.length) {
      return editor?.updateText(text)
    }
    editor?.addText(text);
  }
  const onSetStrokeColor = () => {
    editor?.setStrokeColor(strokeColor)
  }
  const onSetFillColor = () => {
    editor?.setFillColor(fillColor)
  }
  const onDeleteAll = () => {
    editor?.deleteAll();
  }
  const onDeleteSelected = () => {
    editor?.deleteSelected();
  }
  const onZoomIn = () => {
    editor?.zoomIn()
  }
  const onZoomOut = () => {
    editor?.zoomOut()
  }
  return (
    <>
      {editor ? (<div>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onZoomIn}>Zoom In</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onZoomOut}>Zoom Out</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onAddCircle}>Add circle</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onAddRectangle}>Add Rectangle</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onAddLine}>Add Line</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onDeleteAll}>Delete All</button>
        <button className='btn btn-success btn-sm mx-1 my-1' onClick={onDeleteSelected}>Delete Selected</button>

        <div className="container" style={{border: 'none'}}>
          <button className='btn btn-success btn-sm mx-1 my-1' onClick={onAddText}>Add Text &rarr;</button>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Enter Text'
          />

          <button className='btn btn-success btn-sm mx-1 my-1' onClick={onSetStrokeColor}>Set Stroke Color &rarr;</button>
          <input
            type="text"
            value={strokeColor || editor.strokeColor}
            onChange={e => setStrokeColor(e.target.value)}
            placeholder='Enter Stroke Color'
          />

          <button className='btn btn-success btn-sm mx-1 my-1' onClick={onSetFillColor}>Set Fill Color &rarr;</button>
          <input
            type="text"
            value={fillColor || editor.fillColor}
            onChange={e => setFillColor(e.target.value)}
            placeholder='Enter Fill Color'
          />
        </div>

      </div>) : (<>Loading...</>)}
      <FabricJSCanvas className="sample-canvas shadow rounded" onReady={onReady} />
    </>
  )
}

export default Home;