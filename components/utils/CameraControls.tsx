import * as React from "react";
import { FlyControls } from "@react-three/drei";

type ICameraControls = {
  dim: 3 | 2;
};

const CameraControls: React.FC<ICameraControls> = ({ dim }) => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  if (dim === 2) {
    return (
      <FlyControls
        autoForward={false}
        dragToLook={true}
        movementSpeed={50}
        rollSpeed={0.5}
      />
    );
  }

  // Ref to the controls, so that we can update them on every frame using useFrame
  return (
    <FlyControls
      autoForward={false}
      dragToLook={true}
      movementSpeed={50}
      rollSpeed={0.5}
    />
  );
};

export default CameraControls;
