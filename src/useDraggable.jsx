import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export function useDraggable(objects) {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const controls = new DragControls(objects, camera, gl.domElement);
    controlsRef.current = controls;

    controls.addEventListener('dragstart', (event) => {
      event.object.api?.start?.();
    });

    controls.addEventListener('drag', (event) => {
      event.object.api?.set?.(event.object.position);
    });

    controls.addEventListener('dragend', (event) => {
      event.object.api?.stop?.();
    });

    return () => {
      controls.removeEventListener('dragstart');
      controls.removeEventListener('drag');
      controls.removeEventListener('dragend');
      controls.dispose();
    };
  }, [objects, camera, gl]);

  return controlsRef;
}
