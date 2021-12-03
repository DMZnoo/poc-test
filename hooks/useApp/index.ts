import { GraphDataType } from "global.d.types";
import * as React from "react";

export type AppContextProps = {
  loading: boolean;
  setLoading: (val: boolean) => void;
  appTheme: "dark" | "light";
  setAppTheme: (val: "dark" | "light") => void;
  data: GraphDataType | undefined;
  setData: (val: GraphDataType) => void;
  dataGroups: Record<string, any>;
  setDataGroups: (val: Record<string, any>) => void;
  selectedGroupId: string | undefined;
  setSelectedGroupId: (val: string) => void;
  enableScroll: boolean;
  setEnableScroll: (val: boolean) => void;
  fileNames: string[];
  setFileNames: (val: string[]) => void;
  currentFileName: string | undefined;
  setCurrentFileName: (val: string) => void;
  showEdges: boolean;
  setShowEdges: (val: boolean) => void;
};

const useApp = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showEdges, setShowEdges] = React.useState<boolean>(false);
  const [appTheme, setAppTheme] = React.useState<"dark" | "light">("dark");
  const [data, setData] = React.useState<GraphDataType | undefined>();
  const [dataGroups, setDataGroups] = React.useState<Record<string, any>>({});
  const [selectedGroupId, setSelectedGroupId] = React.useState<
    string | undefined
  >();
  const [enableScroll, setEnableScroll] = React.useState<boolean>(true);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [currentFileName, setCurrentFileName] = React.useState<
    string | undefined
  >();

  return {
    loading,
    setLoading,
    appTheme,
    setAppTheme,
    data,
    setData,
    dataGroups,
    setDataGroups,
    selectedGroupId,
    setSelectedGroupId,
    enableScroll,
    setEnableScroll,
    fileNames,
    setFileNames,
    currentFileName,
    setCurrentFileName,
    showEdges,
    setShowEdges,
  };
};

export const AppContext = React.createContext<AppContextProps>(
  {} as AppContextProps
);

export default useApp;
