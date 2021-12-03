import * as React from "react";
import { FlyControls, OrbitControls } from "@react-three/drei";

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
    // <flyControls
    //   args={[camera, domElement]}
    //   movementSpeed={1000}
    //   rollSpeed={Math.PI / 24}
    //   dragToLook={false}
    //   autoForward={false}

    //   // enableZoom={false}
    //   // maxAzimuthAngle={Math.PI / 4}
    //   // maxPolarAngle={Math.PI}
    //   // minAzimuthAngle={-Math.PI / 4}
    //   // minPolarAngle={0}
    // />
    <FlyControls
      autoForward={false}
      dragToLook={true}
      movementSpeed={50}
      rollSpeed={0.5}
    />
    // <FirstPersonControls
    //   activeLook={true}
    //   autoForward={false}
    //   constrainVertical={false}
    //   enabled={mouseInView}
    //   heightCoef={1}
    //   heightMax={1}
    //   heightMin={0}
    //   heightSpeed={false}
    //   lookVertical={true}
    //   lookSpeed={0.05}
    //   movementSpeed={10}
    //   verticalMax={Math.PI}
    //   verticalMin={0}
    // />
  );
};

export default CameraControls;
