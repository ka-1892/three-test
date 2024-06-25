import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls } from 'three/examples/jsm/controls/DragControls';




export function useDraggable(objects, setPosition) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (typeof setPosition !== 'function') {
      console.error('setPosition must be a function');
      return;
    }


    const controls = new DragControls(objects, camera, gl.domElement);
    controlsRef.current = controls;

    controls.addEventListener('dragstart', () => console.log('Drag started'));

    controls.addEventListener('drag', (event) => {
      console.log('Dragging:', event.object.position);
      const { x, y, z } = event.object.position;
      setPosition([x, y, z]);  // Update position
    });

    controls.addEventListener('dragend', () => 
      console.log('Drag ended')
    );

    return () => {
      console.log("removing events")
      controls.removeEventListener('drag');
      controls.removeEventListener('dragstart');
      controls.removeEventListener('dragend');
      controls.dispose();
    };

  }, [objects, camera, gl]); 

  return controlsRef;
}


// export function useDraggable(objects) {
//   const { camera, gl, scene } = useThree();
//   const controlsRef = useRef();

//   useEffect(() => {
//     const controls = new DragControls(objects, camera, gl.domElement);
//     controlsRef.current = controls;

//     controls.addEventListener('dragstart', (event) => {
//       console.log("drag started");
//       event.object.api?.start?.();
//     });

//     controls.addEventListener('drag', (event) => {
//       console.log("drag", event.object.position, objects[0].position);
//       event.object.api?.set?.(event.object.position);
//     });

//     controls.addEventListener('dragend', (event) => {
//       event.object.api?.stop?.();
//     });

//     return () => {
//       controls.removeEventListener('dragstart');
//       controls.removeEventListener('drag');
//       controls.removeEventListener('dragend');
//       controls.dispose();
//     };
//   }, [objects, camera, gl]);

//   return controlsRef;
// }