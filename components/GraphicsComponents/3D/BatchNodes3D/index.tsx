import * as React from "react";
import * as THREE from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import Link from "components/GraphicsComponents/Link";
import { CanvasContext, CanvasContextProps } from "hooks/useCanvas";
import { Instance, Instances, Html } from "@react-three/drei";
import { Color, Vector3 } from "three";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { GraphLink, LinkType, Node } from "global.d.types";
import { InfoBox } from "./styles";

const BatchNodes3D = () => {
  const [selectedNodeId, setSelectedNodeId] = React.useState<number>(-1);

  const {
    graphData,
    setLoading,
    loading,
    layer,
    selectedGroupId,
    enableScroll,
    canvasTheme,
    setGroups,
    showLinks,
    links,
    setLinks,
  } = React.useContext<CanvasContextProps>(CanvasContext);

  const {
    camera,
    scene,
    gl: { domElement },
  } = useThree();

  React.useEffect(() => {
    if (canvasTheme === "dark") {
      scene.background = new THREE.Color(0x000000);
    } else {
      scene.background = new THREE.Color(0xffffff);
    }
  }, [canvasTheme]);

  const setNodePositionAndEdges = React.useCallback(() => {
    setLoading(true);
    const edgesArr: any = [];
    graphData["links"].forEach((link: LinkType, i: number) => {
      console.log("link: ", link);
      const sourceNode = graphData["nodes"].find(
        (n: Node) => n.id === link["source"]
      );
      const targetNode = graphData["nodes"].find(
        (n: Node) => n.id === link["target"]
      );
      console.log("sourceNode: ", sourceNode);
      if (sourceNode && targetNode) {
        edgesArr.push({
          source: {
            id: sourceNode.id,
            position: sourceNode.position,
            group: sourceNode.group.id,
          },
          target: {
            id: targetNode.id,
            position: targetNode.position,
            group: targetNode.group.id,
          },
        });
      }
    });
    console.log("link rec: ", edgesArr);
    setLinks(edgesArr);
    setLoading(false);
  }, [layer, graphData, setLoading]);

  React.useEffect(() => {
    if (graphData) {
      if (graphData.nodes.length > 0 || graphData.links.length > 0) {
        setGroups(Object.keys(graphData["groups"]));
        setNodePositionAndEdges();
        console.log("3d graphData: ", graphData);
      }
    }
  }, [graphData]);

  React.useEffect(() => {
    document.addEventListener("wheel", onDocumentMouseWheel, false);
  }, []);

  function onDocumentMouseWheel(event: WheelEvent) {
    if (enableScroll) {
      camera.position.z += event.deltaY / 10;
    }
  }

  if (loading || !graphData) {
    return <></>;
  }

  return (
    <>
      <Instances limit={2000} range={2000}>
        <sphereGeometry attach="geometry" args={[0.1, 100, 100]} />
        <meshPhongMaterial opacity={1} transparent={true} />
        <>
          {graphData["nodes"]
            .filter((node: Node) =>
              selectedGroupId ? node.group.id === selectedGroupId : node
            )
            .map((node: Node, i: number) => {
              return (
                <Instance
                  key={node.id}
                  color={new Color(node.color)}
                  position={new Vector3().fromArray(node.position)}
                  scale={2}
                  onClick={(e: ThreeEvent<MouseEvent>) => {
                    e.instanceId && setSelectedNodeId(e.instanceId);
                  }}
                >
                  {i === selectedNodeId && (
                    <>
                      <Html distanceFactor={5}>
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
                      <Html distanceFactor={10}>
                        <div
                          className={
                            "transform translate-x-20 -translate-y-72 text-white cursor-pointer"
                          }
                        >
                          <div className="ag-theme-alpine h-48 w-80">
                            <AgGridReact rowData={[{ id: node.id }]}>
                              <AgGridColumn field="id" />
                            </AgGridReact>
                          </div>
                        </div>
                      </Html>
                    </>
                  )}
                </Instance>
              );
            })}
        </>
      </Instances>
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

export default BatchNodes3D;
