import * as React from "react";
import { GraphDataType } from "../../global.d.types";

export type CanvasContextProps = {
  showEdges: boolean;
  setShowEdges: (val: boolean) => void;
  nodeCount: number;
  setNodeCount: (val: number) => void;
  layer: number;
  setLayer: (val: number) => void;
  showLabel: boolean;
  toggleLabel: (val: boolean) => void;
  graphData: any;
  setGraphData: (val: any) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
  dim: 3 | 2;
  setDim: (val: 3 | 2) => void;
  selectedGroupId: string | undefined;
  setSelectedGroupId: (val: string | undefined) => void;
  canvasTheme: "dark" | "light";
  setCanvasTheme: (val: "dark" | "light") => void;
  groups: Record<string, any>;
  setGroups: (val: Record<string, any>) => void;
  enableScroll: boolean;
  setEnableScroll: (val: boolean) => void;
};

const useCanvas = (): CanvasContextProps => {
  const [showEdges, setShowEdges] = React.useState<boolean>(false);
  const [nodeCount, setNodeCount] = React.useState<number>(0);
  const [layer, setLayer] = React.useState<number>(0);
  const [showLabel, toggleLabel] = React.useState<boolean>(true);
  const [canvasTheme, setCanvasTheme] = React.useState<"dark" | "light">(
    "dark"
  );
  const [graphData, setGraphData] = React.useState<GraphDataType>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dim, setDim] = React.useState<3 | 2>(3);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>();
  const [groups, setGroups] = React.useState<Record<string, any>>({});
  const [enableScroll, setEnableScroll] = React.useState<boolean>(true);

  return {
    showEdges,
    setShowEdges,
    nodeCount,
    setNodeCount,
    setLayer,
    layer,
    showLabel,
    toggleLabel,
    graphData,
    setGraphData,
    loading,
    setLoading,
    dim,
    setDim,
    selectedGroupId,
    setSelectedGroupId,
    canvasTheme,
    setCanvasTheme,
    groups,
    setGroups,
    enableScroll,
    setEnableScroll,
  };
};

export const CanvasContext = React.createContext<CanvasContextProps>(
  {} as CanvasContextProps
);

export default useCanvas;
