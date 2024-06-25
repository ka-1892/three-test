import { useRef, useState, useEffect, useCallback, forwardRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Environment, useGLTF, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { useDraggable } from './useDraggable';


function DraggableScene(props) {
  const boxRef = useRef();
  const objects = [boxRef.current].filter(Boolean);  // Filter out null refs
  const [position, setPosition] = useState(props.position);  // Assuming you want to track the position state
  
  //useDraggable(objects, setPosition);
  //useDraggable(objects);

  // useEffect(()=>{

  //   console.log('position:', position);
  // },[position])

  // useEffect(()=>{

  //   console.log('boxRef:', boxRef);
  // },[boxRef])

  return (
    <mesh ref={boxRef}
    position={position}
      {...props}
    >
      <boxGeometry args={[1, 5, 1]} />
      <meshStandardMaterial color='royalblue' />
    </mesh>
  );
}

const EditableHtmlElement = ({ position, content }) => {


  console.log("EditableHtmlElement position:", position);
  return (
    <Html position={position} style={{ userSelect: 'none' }} transform>
      <div contentEditable style={{width: "50px",height: "50px" }}>
        {content}
      </div>
    </Html>
  );


}


const InvisibleMesh = forwardRef(({ position }, ref) => {
  useEffect(() => {
    console.log('InvisibleMesh Position:', position);
  }, [position]);

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[2, 2, 0.1]} />
      <meshPhongMaterial transparent opacity={0.15} color="#111111" />
    </mesh>
  );
});

function DraggableHtmlObject({ initialPosition, content }) {
  const meshRef = useRef();
  //const objects = [meshRef.current].filter(Boolean);

  const objects = useMemo(() => [meshRef.current].filter(Boolean), [meshRef.current]);
  const [x, setX] = useState(initialPosition[0]);
  const [y, setY] = useState(initialPosition[1]);
  const [z, setZ] = useState(initialPosition[2]);

  const setPosition = ([newX, newY, newZ]) => {
    setX(newX);
    setY(newY);
    setZ(newZ);
  };

  //const position = useMemo(() => [x, y, z], [x, y, z]); 
  const position = () => ([x, y, z], [x, y, z]); 
  
  useDraggable(objects, setPosition);

  useEffect(()=>{

    console.log('position:', position);
  },[x,y,z])

  // const ret = useDraggable(objects);

  // console.log('Draggable', ret)
  return (
    <>
      <EditableHtmlElement position={[x,y,z]} content={content} />
      <InvisibleMesh ref={meshRef} position={initialPosition} />
    </>
  );
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



function App() {

  const [dragFlag, setDragFlag] = useState(false)

  return (
    <div>
      <ControlUI setDragFlag={setDragFlag} />
    <Canvas>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <ambientLight intensity={0.5} />
      <DraggableScene position={[0, 0, 0]} />
      <DraggableScene position={[1, 2, 3]} />
      <DraggableHtmlObject initialPosition={[2, 2, 2]}  content="Edit me!" />
      <DraggableHtmlObject initialPosition={[0, 0, 0]}  content="Another editable div!" />
      <OrbitControls enablePan={dragFlag} enableRotate={dragFlag} />
      {/* <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} /> */}
      
      <gridHelper args={[20, 20]} position={[0, -0.5, 0]} />
      {/* <Html style={{ userSelect: 'none' }} castShadow receiveShadow occlude="blending" transform>
        <div contentEditable style={{ width: '300px', height: '200px' }} spellCheck={false}>
          write me
        </div>
      </Html> */}
      <Environment preset="city" />
    </Canvas>
    </div>
  );
}

export default App;
