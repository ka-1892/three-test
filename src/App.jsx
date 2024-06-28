import { useRef, useState, useEffect, useCallback, forwardRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Environment, useGLTF, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { useDraggable } from './useDraggable';
import html2canvas from 'html2canvas';
import * as THREE from 'three';

const htmlToTexture = async (html) => {
  const canvas = await html2canvas(html);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};


function HTMLTexture({ htmlContent, position }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState();
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    console.log("Texture set at init:", texture, meshRef);
  }, []);


  useEffect(() => {
    console.log("Texture set:", texture);
  }, [texture]);

  useEffect(() => {
    console.log("Texture texture set:", updateKey, texture, meshRef);
  }, [updateKey]);


  useEffect(() => {
    const div = document.createElement('div');
   
    div.innerHTML = htmlContent;
    console.log("Texture htmlContent:", htmlContent);
    div.style.width = '500px';  // Set width and height as needed
    div.style.height = '300px';
    div.style.fontSize = '23px';
    div.style.fontWeight = '800';
    document.body.appendChild(div);  // Append temporarily to the body to render

    htmlToTexture(div).then((tex) => {
      setTexture(tex);
      //div.style.display = 'transparent';
      setUpdateKey(prev => prev + 1);
      document.body.removeChild(div);  // Clean up
    });
  }, [htmlContent]);


  const handleHtmlClick = (e) => {
   e.preventDefault();
   console.log("content clicked at HTMLTexture")
  }

  return (
    <mesh key={updateKey} ref={meshRef} position={position} onClick={handleHtmlClick}>
      {/*https://stackoverflow.com/questions/76790629/planebuffergeometry-is-not-part-of-the-three-namespace */}
      <planeGeometry attach="geometry" args={[5.5, 2.5]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}


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

const EditableHtmlElement = ({ position, content, contentEditFlag, setInnerHtmlContent, setcontentEditFlag}) => {

  const divRef = useRef();
  //const htmlInstanceRef = useRef(null);
  const [htmlInstance, setHtmlInstance] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");


  const updateHtmlInstance = useCallback(() => {
    setHtmlInstance(divRef.current.childNodes);
  }, [divRef]);

  const handleHtmlClick = () =>{
    //console.log("content clicked at", content)
    //toggleEditing();
 }

  // useEffect(() => {
  //   if (contentEditFlag) {
  //     const frontalHtml = '<div id="content">';
  //     const rearHtml = '</div>';
  //     const changedHtml = frontalHtml.concat(divRef.current.innerHTML, rearHtml);

  //     setInnerHtmlContent(changedHtml);  // Updating the inner HTML content
  //     htmlInstanceRef.current = divRef.current.childNodes;
      
  //     // Execute the callback conditionally
  //     updateHtmlInstance();
      
  //     setcontentEditFlag(false);  // Reset the flag
  //   }
  // }, [contentEditFlag, setInnerHtmlContent, setcontentEditFlag, updateHtmlInstance]);

  useEffect(() => {
    // Convert NodeList to a string or a React element array when contentEditFlag is toggled
    if (contentEditFlag && divRef.current) {
      const html = Array.from(divRef.current.childNodes).map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent ;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          return <span key={node.textContent} style={{ backgroundColor: node.style.backgroundColor }}>{node.textContent}</span>;
        }
        return null;
      });

      const fullHtml = `<div>${html}</div>`;
      setInnerHtmlContent(fullHtml);  // Updating the inner HTML content
      setHtmlContent(html);  // Set the processed HTML for rendering
      setcontentEditFlag(false);  // Reset the flag
    }
  }, [contentEditFlag, setInnerHtmlContent, setcontentEditFlag]);

  useEffect(() => {

    if(htmlInstance){
      console.log("htmlInstance in [htmlInstance]: ", htmlInstance);
      
    }

  }, [htmlInstance]);

  useEffect(() => {

    if(htmlInstance){
      console.log("htmlInstance:", htmlInstance);
      //console.log("htmlInstanceRef", htmlInstanceRef.current);
    }

  }, []);

  // const updateHtmlContent = useCallback((newlyIntance)=>{
  //   setHtmlInstance(newlyIntance)
  // },[])


  return (
    <Html position={position} style={{ userSelect: 'none' }} transform>
      <div  id="content_edit_div" ref={divRef}   onClick={handleHtmlClick}  
      spellCheck={false}
      contentEditable={true} style={{width: "200px",height: "100px", fontSize: "10px" }}>
        {/* {htmlInstance ? htmlInstance : content} */}
        {htmlContent.length > 0 ? htmlContent : content}
      </div>
    </Html>
  );
  
  
}


const InvisibleMesh = forwardRef(({ position, toggleEditing }, ref) => {
  useEffect(() => {
    console.log('InvisibleMesh Position:', position);
  }, [position]);


  const handlecontextMenu = (e) =>{
    e.preventDefault();
    console.log("context menu", e.target.content)
  }

  const handleHtmlClick = (e) =>{
    //e.preventDefault();
    console.log("content clicked at InvisibleMesh")
    toggleEditing();
 }

  return (
    <mesh ref={ref} position={position} onContextMenu={handlecontextMenu} onClick={handleHtmlClick} >
      <boxGeometry args={[6, 3, 0.1]} />
      <meshPhongMaterial transparent opacity={1} color="tomato" />
    </mesh>
  );
});

function DraggableHtmlObject({ initialPosition, content, dragFlag,contentEditFlag, setcontentEditFlag }) {
  const meshRef = useRef();
  //const objects = [meshRef.current].filter(Boolean);

  const [isEditing, setIsEditing] = useState(false);
  const [innerHtmlContent, setInnerHtmlContent] = useState(content);
  

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
  
  // if(dragFlag === false){
  //   useDraggable(objects, setPosition);
  // }

  useDraggable(objects, setPosition, !dragFlag);
  

  useEffect(()=>{

    console.log('innerHtmlContent in DraggableHtmlObject:', innerHtmlContent);
  },[innerHtmlContent])

  useEffect(()=>{

    console.log('isEditing in DraggableObject:', isEditing);
  },[isEditing])



  useCallback(()=>{
    setInnerHtmlContent(content);
  },[])

  // const ret = useDraggable(objects);
  const toggleEditing = () => setIsEditing(!isEditing); 
  

  // console.log('Draggable', ret)
  return (
    <>
      {isEditing ? (
        <EditableHtmlElement  key="editable" position={[x, y, z]} 
        content={content} contentEditFlag={contentEditFlag}  
        setcontentEditFlag={setcontentEditFlag}
        toggleEditing={toggleEditing} setInnerHtmlContent={setInnerHtmlContent}/>
      ) : (
        <HTMLTexture  key="texture"  htmlContent={innerHtmlContent} position={[x, y, z + 0.1]} />
      )}
      <InvisibleMesh ref={meshRef} position={initialPosition} toggleEditing={toggleEditing}/>
    </>
  );
}


function ControlUI(props) {
  const handleDragButton = () => {
    console.log('button')
    props.setDragFlag((prev) => !prev)
  }

  const handleEditButton = () => {
    console.log('content edit button');
    props.setcontentEditFlag((prev) => !prev)
  }

  return (
    <div className="controlPanel">
      <button onClick={handleDragButton}> Drag </button>
      <button onClick={handleEditButton}> Edit</button>
    </div>
  )
}



function App() {

  const [dragFlag, setDragFlag] = useState(false)
  const [contentEditFlag, setcontentEditFlag] = useState(false)

 
  useEffect(()=>{

    console.log('contentEditFlag', contentEditFlag);
  },[contentEditFlag])

  return (
    <div>
      <ControlUI setDragFlag={setDragFlag} setcontentEditFlag={setcontentEditFlag}/>
    <Canvas>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <ambientLight intensity={0.5} />
      {/* <DraggableScene position={[0, 0, 0]} />
      <DraggableScene position={[1, 2, 3]} /> */}
      <DraggableHtmlObject dragFlag={dragFlag} contentEditFlag={contentEditFlag} setcontentEditFlag={setcontentEditFlag} initialPosition={[2, 2, 2]}  content="Edit me!" />
      {/* <DraggableHtmlObject dragFlag={dragFlag} initialPosition={[0, 0, 0]}  content="Another editable div!" /> */}
      <HTMLTexture htmlContent="<div style='color: red; font-size: 40px;'> Hello hello me!</div>" position={[4, 4, 4]} />
      <OrbitControls enablePan={dragFlag} enableRotate={dragFlag} />      
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
