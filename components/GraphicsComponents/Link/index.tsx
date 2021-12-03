import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { AppContext, AppContextProps } from "../../../hooks/useApp";
interface IEdge {
  coords: number[];
  nextCoords: number[];
  visibility: boolean;
  color?: string;
}
const Link: React.FC<IEdge> = ({
  coords,
  nextCoords,
  visibility,
  color = "#9c88ff",
}) => {
  const ref = React.useRef<any>();
  const points = React.useMemo(
    () => [
      new THREE.Vector3().fromArray(coords),
      new THREE.Vector3().fromArray(nextCoords),
    ],
    [coords, nextCoords]
  );
  const onUpdate = React.useCallback(
    (self) => self.setFromPoints(points),
    [points]
  );

  useFrame(() => {
    if (ref.current) {
      ref.current.visible = visibility;
    }
  });

  return (
    <>
      <line>
        <bufferGeometry attach="geometry" onUpdate={onUpdate} />
        <lineBasicMaterial
          ref={ref}
          attach="material"
          color={color}
          linewidth={10}
          linecap={"round"}
          linejoin={"round"}
        />
      </line>
    </>
  );
};
export default Link;
