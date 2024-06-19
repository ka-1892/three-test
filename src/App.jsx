import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from '@react-three/drei'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  const { camera, gl, scene } = useThree()

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = useCallback((event) => {
    const controls = new DragControls(objects, camera, gl.domElement)

    setIsDragging(true)
    event.target.setPointerCapture(event.pointerId) // Lock the pointer to the mesh
  }, [])

  const onPointerUp = useCallback((event) => {
    setIsDragging(false)
    event.target.releasePointerCapture(event.pointerId) // Release the pointer from the mesh
  }, [])

  const onPointerMove = useCallback(
    (event) => {
      if (isDragging) {
        const [x, y] = [event.unprojectedPoint.x, event.unprojectedPoint.y]
        ref.current.position.set(x, y, 0)
      }
    },
    [isDragging]
  )

  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function ControlUI(props) {
  const handleDragButton = () => {
    console.log('button')
    props.setDragFlag((prev) => !prev)
  }

  return (
    <div className="controlPanel">
      <button onClick={handleDragButton}> drag </button>
      <button> other</button>
    </div>
  )
}

export default function App() {
  const [dragFlag, setDragFlag] = useState(false)

  useEffect(() => {
    console.log('dragFlag', dragFlag)
  }, [dragFlag])

  return (
    <div>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <OrbitControls enablePan={dragFlag} enableRotate={dragFlag} />
        <gridHelper args={[20, 20]} position={[0, -0.5, 0]} />
      </Canvas>
      <ControlUI setDragFlag={setDragFlag} />
    </div>
  )
}
