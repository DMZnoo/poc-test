import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as React from "react";
import { GraphLink, LinkType, Node } from "global.d.types";
import { Vector3 } from "three";
import { Circle, Html } from "@react-three/drei";
import { InfoBox } from "components/GraphicsComponents/3D/BatchNodes3D/styles";
import { AgGridReact } from "ag-grid-react";
import { AgGridColumn } from "ag-grid-react/lib/shared/agGridColumn";
import { CanvasContext, CanvasContextProps } from "hooks/useCanvas";
import Link from "components/GraphicsComponents/Link";

const BatchNodes2D = () => {
  const { graphData } = React.useContext<CanvasContextProps>(CanvasContext);
  const [links, setLinks] = React.useState<Record<string, any>>();
  const [nodeInfo, setNodeInfo] = React.useState<Record<string, boolean>>({});
  const [defaultNodeInfo, setDefaultNodeInfo] = React.useState<
    Record<string, boolean>
  >({});
  const { canvasTheme, selectedGroupId, enableScroll, showLinks, setLoading } =
    React.useContext<CanvasContextProps>(CanvasContext);
  const { scene, camera } = useThree();

  function onDocumentMouseWheel(event: WheelEvent) {
    if (enableScroll) {
      console.log("2d enabled");
      camera.position.z += event.deltaY / 100;
    }
  }

  React.useEffect(() => {
    document.addEventListener("wheel", onDocumentMouseWheel, false);
  }, []);

  React.useEffect(() => {
    if (canvasTheme === "dark") {
      scene.background = new THREE.Color(0x000000);
    } else {
      scene.background = new THREE.Color(0xffffff);
    }
  }, [canvasTheme]);

  const buildLinks = () => {
    setLoading(true);
    const linkRec: any = [];
    graphData["links"].forEach((link: LinkType) => {
      const sourceNode = graphData["nodes"].find(
        (n: Node) => n.id === link["source"]
      );
      const targetNode = graphData["nodes"].find(
        (n: Node) => n.id === link["target"]
      );
      if (sourceNode && targetNode) {
        linkRec.push({
          source: {
            id: sourceNode.id,
            position: sourceNode.position,
            group: sourceNode.group,
          },
          target: {
            id: targetNode.id,
            position: targetNode.position,
            group: targetNode.group,
          },
          color: Math.random() * 0x9c88ff,
        });
      }
    });
    setLinks(linkRec);
    setLoading(false);
  };

  React.useEffect(() => {
    if (graphData) {
      if (graphData.nodes.length > 0 || graphData.links.length > 0) {
        document.addEventListener("wheel", onDocumentMouseWheel, false);
        buildLinks();
        console.log("2d graphData: ", graphData);
      }
    }
  }, [graphData]);

  return (
    <>
      {graphData && (
        <>
          {graphData["nodes"]
            .filter((node: Node) =>
              selectedGroupId ? selectedGroupId === node.group : node
            )
            .map((node: Node) => {
              return (
                <>
                  <Circle
                    key={node.id}
                    args={[0.1, 100]}
                    position={new Vector3().fromArray(node.position)}
                    onPointerOver={(e) => {
                      setNodeInfo(defaultNodeInfo);
                      setNodeInfo((nodeInfo) => ({
                        ...nodeInfo,
                        [node.id]: !nodeInfo[node.id],
                      }));
                    }}
                  >
                    <meshBasicMaterial
                      attach="material"
                      color={graphData["groups"][node.group].color}
                      opacity={1}
                      transparent={true}
                    />
                  </Circle>
                  {nodeInfo[node.id] && (
                    <>
                      <Html
                        distanceFactor={5}
                        position={new Vector3().fromArray(node.position)}
                      >
                        <div
                          className={
                            "transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
                          }
                        >
                          <div>{node.id}</div>
                          <InfoBox className="label-box" isNode={true}>
                            <div className="label-box-content" />
                          </InfoBox>
                        </div>
                      </Html>
                      <Html
                        distanceFactor={10}
                        position={new Vector3().fromArray(node.position)}
                      >
                        <div
                          className={
                            "transform translate-x-20 -translate-y-72 text-white cursor-pointer"
                          }
                        >
                          <div className="ag-theme-alpine h-48 w-80">
                            <AgGridReact
                              rowData={[
                                {
                                  id: node.id,
                                  group: node.group.name || node.group.id,
                                },
                              ]}
                            >
                              <AgGridColumn field="id" />
                              <AgGridColumn field="group" />
                            </AgGridReact>
                          </div>
                        </div>
                      </Html>
                    </>
                  )}
                </>
              );
            })}
        </>
      )}
      {links &&
        links
          .filter((edge: GraphLink) =>
            selectedGroupId
              ? edge.source.group === selectedGroupId ||
                edge.target.group === selectedGroupId
              : edge
          )
          .map((edge: GraphLink, i: number) => {
            return (
              <Link
                key={"edge-" + i}
                coords={edge.source.position}
                nextCoords={edge.target.position}
                visibility={showLinks}
              />
            );
          })}
    </>
  );
};
export default BatchNodes2D;
