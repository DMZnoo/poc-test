import * as React from "react";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import BatchNodes2D from "components/GraphicsComponents/2D/BatchNodes2D";
import CameraControls from "components/utils/CameraControls";
import StatsComponent from "components/utils/StatsComponent";
import Widget from "components/Widget";
import useCanvas, { CanvasContext } from "hooks/useCanvas";
import DropZone from "components/DropZone";
import { AppContext, AppContextProps } from "hooks/useApp";
import Loading from "components/Loading";
import BatchNodes3D from "components/GraphicsComponents/3D/BatchNodes3D";
import app from "next/app";

const Home: NextPage = () => {
  const context = useCanvas();
  const {
    loading,
    setLoading,
    dim,
    layer,
    setLayer,
    setDim,
    graphData,
    setGraphData,
    setCanvasTheme,
    groups,
    setGroups,
    setSelectedGroupId,
    setEnableScroll,
    setShowEdges,
  } = context;
  const appContext = React.useContext<AppContextProps>(AppContext);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  if (appContext.loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-screen">
      {loading ? (
        <Loading />
      ) : (
        <div className="absolute w-screen h-screen">
          <AppContext.Consumer>
            {(value) => {
              setCanvasTheme(value.appTheme);
              value.setDataGroups(groups);
              setGraphData(value.data);
              setEnableScroll(value.enableScroll);
              setShowEdges(value.showEdges);
              if (value.selectedGroupId) {
                setSelectedGroupId(value.selectedGroupId);
              }
              return (
                <Canvas>
                  <CanvasContext.Provider value={context}>
                    <ambientLight />
                    <pointLight position={[0, 0, 0]} />
                    <axesHelper />
                    <perspectiveCamera
                      aspect={window.innerWidth / window.innerHeight}
                      fov={30}
                      position={[0, 0, 2]}
                      near={0.5}
                      far={10000000}
                    />
                    {dim === 3 && (
                      <>
                        <BatchNodes3D />
                      </>
                    )}
                    {dim === 2 && (
                      <>
                        <BatchNodes2D />
                      </>
                    )}
                    <CameraControls dim={dim} />
                    <StatsComponent />
                  </CanvasContext.Provider>
                </Canvas>
              );
            }}
          </AppContext.Consumer>
        </div>
      )}
      <Widget setLayer={setLayer} layer={layer} setDim={setDim} dim={dim} />
      <div className="absolute mt-20 w-60">
        <DropZone setGraphData={setGraphData} setDim={setDim} />
      </div>
    </div>
  );
};

export default Home;
