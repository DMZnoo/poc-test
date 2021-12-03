import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import * as React from "react";
import { GraphLink, LinkType, Node } from "../../../../global.d.types";
import { MathUtils, Vector3 } from "three";
import { Circle, Html, Plane, Ring } from "@react-three/drei";
import { InfoBox } from "components/GraphicsComponents/3D/BatchNodes3D/styles";
import { AgGridReact } from "ag-grid-react";
import { AgGridColumn } from "ag-grid-react/lib/shared/agGridColumn";
import { CanvasContext, CanvasContextProps } from "hooks/useCanvas";
import Link from "components/GraphicsComponents/Link";

const BatchNodes2D = () => {
  const { graphData } = React.useContext<CanvasContextProps>(CanvasContext);
  const [records, setRecords] = React.useState<Record<string, any>>();
  const [links, setLinks] = React.useState<Record<string, any>>();
  const [nodeInfo, setNodeInfo] = React.useState<Record<string, boolean>>({});
  const [defaultNodeInfo, setDefaultNodeInfo] = React.useState<
    Record<string, boolean>
  >({});
  const [groupInfo, setGroupInfo] = React.useState<Record<string, boolean>>({});
  const [defaultGroupInfo, setDefatultGroupInfo] = React.useState<
    Record<string, boolean>
  >({});
  const {
    canvasTheme,
    setGroups,
    groups,
    selectedGroupId,
    enableScroll,
    showEdges,
  } = React.useContext<CanvasContextProps>(CanvasContext);
  const { scene, camera } = useThree();

  function onDocumentMouseWheel(event: WheelEvent) {
    if (enableScroll) {
      console.log("enabled");
      camera.position.z += event.deltaY / 5;
    }
  }

  React.useEffect(() => {
    document.addEventListener("wheel", onDocumentMouseWheel, false);
  });

  React.useEffect(() => {
    if (canvasTheme === "dark") {
      scene.background = new THREE.Color(0x000000);
    } else {
      scene.background = new THREE.Color(0xffffff);
    }
  }, [canvasTheme]);

  React.useEffect(() => {
    if (graphData) {
      const rec: any = {};
      const linkRec: any = [];
      const groupInfos: any = {};
      graphData["nodes"].forEach((node: Node) => {
        const name = node.group.name ? node.group.name : node.group.id;
        if (name) {
          if (!Object.keys(groupInfos).includes(name)) {
            const randomColor = Math.random() * 0xffffff;
            groupInfos[name] = {
              positions: node.group.positions,
              color: randomColor,
            };
            rec[node.id] = {
              position: [node.position[0], node.position[1], 0],
              color: randomColor,
              group: node.group,
            };
            setNodeInfo((nodeInfo) => ({
              ...nodeInfo,
              [node.id]: false,
            }));
          } else {
            const groupInfo = groupInfos[name];
            rec[node.id] = {
              position: [node.position[0], node.position[1], 0],
              color: groupInfo.color,
              group: node.group,
            };
            setGroupInfo((groupInfo) => ({
              ...groupInfo,
              [name]: false,
            }));
          }
        } else {
          alert("The group name or id is missing in the dataset!");
        }
      });
      setDefaultNodeInfo(nodeInfo);
      setDefatultGroupInfo(groupInfo);
      setGroups(groupInfos);
      graphData["links"][0].forEach((link: LinkType) => {
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
              group: {
                id: sourceNode.group.id || sourceNode.group.name,
              },
            },
            target: {
              id: targetNode.id,
              position: targetNode.position,
              group: {
                id: targetNode.group.id || targetNode.group.name,
              },
            },
            color: Math.random() * 0x9c88ff,
          });
        }
      });
      console.log("rec: ", rec);
      console.log("linkRec: ", linkRec);
      setLinks(linkRec);
      setRecords(rec);
    }
  }, [graphData]);

  return (
    <>
      {records && (
        <>
          {Object.entries(records).map((p, i) => {
            return (
              <>
                <Circle
                  key={p[0]}
                  args={[0.1, 100]}
                  position={new Vector3().fromArray(p[1].position)}
                  onPointerOver={(e) => {
                    setNodeInfo(defaultNodeInfo);
                    setNodeInfo((nodeInfo) => ({
                      ...nodeInfo,
                      [p[0]]: !nodeInfo[p[0]],
                    }));
                  }}
                >
                  <meshBasicMaterial
                    attach="material"
                    color={p[1].color}
                    opacity={1}
                    transparent={true}
                  />
                </Circle>
                {nodeInfo[p[0]] && (
                  <>
                    <Html
                      distanceFactor={5}
                      position={new Vector3().fromArray(p[1].position)}
                    >
                      <div
                        className={
                          "transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
                        }
                      >
                        <div>{p[0]}</div>
                        <InfoBox className="label-box" isNode={true}>
                          <div className="label-box-content" />
                        </InfoBox>
                      </div>
                    </Html>
                    <Html
                      distanceFactor={10}
                      position={new Vector3().fromArray(p[1].position)}
                    >
                      <div
                        className={
                          "transform translate-x-20 -translate-y-72 text-white cursor-pointer"
                        }
                      >
                        <div className="ag-theme-alpine h-48 w-80">
                          <AgGridReact
                            rowData={[{ id: p[0], group: p[1].group.name }]}
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
                visibility={showEdges}
              />
            );
          })}
    </>
  );
};
export default BatchNodes2D;
