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
  const [edges, setEdges] = React.useState<any>();
  const [selectedNodeId, setSelectedNodeId] = React.useState<number>(-1);
  const mouse = new THREE.Vector2(1, 1);
  const [showEdges, setShowEdges] = React.useState<boolean>(true);
  const [showGroupInfo, setShowGroupInfo] = React.useState<string>();
  const [moving, setMoving] = React.useState<boolean>(false);

  const {
    graphData,
    setLoading,
    loading,
    layer,
    selectedGroupId,
    setSelectedGroupId,
    enableScroll,
    canvasTheme,
    groups,
    setGroups,
  } = React.useContext<CanvasContextProps>(CanvasContext);
  const [drawSize, setDrawSize] = React.useState<number>(10000);

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
  const setGroupPostion = React.useCallback(() => {
    setLoading(true);
    let tempGroups: any = {};
    let tempSet: any = {};
    graphData["nodes"].forEach((n: Node, i: number) => {
      const groupId = n.group.id;
      if (groupId) {
        if (Object.keys(tempSet).includes(groupId)) {
          tempSet[groupId] += 1;
        } else {
          tempSet[groupId] = 1;
        }
      }
    });
    graphData["nodes"].forEach((n: Node, i: number) => {
      const groupId = n.group.id;
      if (groupId) {
        const pos = n.group.positions;
        tempGroups[groupId] = {
          pos: pos,
          color: Math.random() * 0xffffff,
          nodeCount: tempSet[groupId],
        };
      }
    });
    setGroups(tempGroups);
    setLoading(false);
  }, [graphData, setLoading]);

  const setNodePositionAndEdges = React.useCallback(() => {
    setLoading(true);
    const edgesArr: any = [];
    graphData["links"][0].forEach((link: LinkType, i: number) => {
      const sourceNode = graphData["nodes"].find(
        (n: Node) => n.id === link["source"]
      );
      const targetNode = graphData["nodes"].find(
        (n: Node) => n.id === link["target"]
      );
      if (sourceNode && targetNode) {
        edgesArr.push({
          source: {
            id: sourceNode.id,
            position: sourceNode.position,
            group: {
              id: sourceNode.group.id,
            },
          },
          target: {
            id: targetNode.id,
            position: targetNode.position,
            group: {
              id: targetNode.group.id,
            },
          },
        });
      }
    });
    setEdges(edgesArr);
    setDrawSize(graphData["nodes"].length);
    setLoading(false);
  }, [layer, graphData, setLoading]);

  React.useEffect(() => {
    if (graphData) {
      if (graphData.nodes.length > 0 || graphData.links.length > 0) {
        document.addEventListener("wheel", onDocumentMouseWheel);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("keypress", onKeyPress);
        setGroupPostion();
        setNodePositionAndEdges();
        console.log("graphData: ", graphData);
        setShowEdges(true);
      }
    }
  }, [graphData]);

  function onKeyPress(event: KeyboardEvent) {
    if (
      event.key === "w" ||
      event.key === "a" ||
      event.key === "s" ||
      event.key === "d"
    ) {
      setMoving(true);
    } else {
      setMoving(false);
    }
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onDocumentMouseWheel(event: WheelEvent) {
    if (enableScroll) {
      camera.position.z += event.deltaY / 5;
    }
  }

  // useFrame(() => {
  //   if (
  //     Math.abs(camera.position.x) > 20 ||
  //     Math.abs(camera.position.y) > 20 ||
  //     Math.abs(camera.position.z) > 20
  //   ) {
  //     setLayer("layer-1");
  //   } else {
  //     setLayer("layer-2");
  //   }
  // });

  if (loading || !graphData) {
    return <></>;
  }

  return (
    <>
      <Instances
        limit={graphData["nodes"].length}
        range={graphData["nodes"].length}
      >
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
                  color={
                    node.group.id && groups[node.group.id]
                      ? new Color().setHex(groups[node.group.id].color)
                      : new Color()
                  }
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
      {edges &&
        edges
          .filter((edge: GraphLink) =>
            selectedGroupId
              ? edge.source.group.id === selectedGroupId ||
                edge.target.group.id === selectedGroupId
              : edge
          )
          .map((edge: GraphLink, i: number) => {
            return (
              <Link
                key={"edge-" + i}
                coords={edge.source.position}
                nextCoords={edge.target.position}
                visibility={true}
              />
            );
          })}
    </>
  );
};

export default BatchNodes3D;
