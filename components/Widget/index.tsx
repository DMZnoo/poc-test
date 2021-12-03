import { Listbox, Switch, Transition } from "@headlessui/react";
import DropDownMenu from "components/DropDownMenu";
import { AppContext, AppContextProps } from "hooks/useApp";
import useSessionStorage from "hooks/useSessionStorage";
import * as React from "react";

interface IWidget {
  setLayer: (val: number) => void;
  layer: number;
  dim: 3 | 2;
  setDim: (val: 3 | 2) => void;
}

const Widget: React.FC<IWidget> = ({ setLayer, layer, dim, setDim }) => {
  const [linkSize, setLinkSize] = React.useState<number>(0);

  const {
    appTheme,
    setAppTheme,
    data,
    dataGroups,
    setSelectedGroupId,
    selectedGroupId,
    setCurrentFileName,
    setData,
    fileNames,
    currentFileName,
    setShowEdges,
    showEdges,
  } = React.useContext<AppContextProps>(AppContext);

  const [cachedData, setCachedData] = useSessionStorage<Record<string, any>>(
    "cachedData",
    {}
  );

  React.useEffect(() => {
    if (data && Object.keys(data).includes("links")) {
      let size = 0;
      data["links"].forEach((linkArr) => (size += linkArr.length));
      setLinkSize(size);
    }
  }, [data]);
  return (
    <div
      className={`absolute w-full h-full ${
        appTheme === "dark" ? "text-white" : "text-dark"
      }`}
    >
      <div className="flex flex-col items-end">
        <div className="flex space-x-5 mr-4">
          {data && fileNames.length > 0 && (
            <DropDownMenu
              data={fileNames}
              selected={currentFileName}
              setSelected={(e) => {
                console.log(e);
                console.log(cachedData);
                if (cachedData[e]) {
                  if (cachedData[e].includes("2d")) {
                    setDim(2);
                  } else {
                    setDim(3);
                  }
                  const loaded = JSON.parse(cachedData[e]);
                  setData(loaded);
                } else {
                  alert("Sorry that data has been lost..");
                }
                setCurrentFileName(e);
              }}
            />
          )}
        </div>
        <div className="py-4 mr-2">
          <Switch.Group>
            <div className="flex items-center">
              <Switch.Label className={`mr-4`}>Dimension: {dim}</Switch.Label>
              <Switch
                checked={dim === 3}
                onChange={() => {
                  if (dim === 3) {
                    setDim(2);
                  } else {
                    setDim(3);
                  }
                  setData({ nodes: [], links: [] });
                }}
                className={`${dim === 3 ? "bg-teal-700" : "bg-red-700"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Change Dimensions of Graph</span>
                <span
                  aria-hidden="true"
                  className={`${dim === 3 ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </Switch.Group>
          <Switch.Group>
            <div className="flex items-center mt-4">
              <Switch.Label
                className={`mr-4 capitalize ${
                  appTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {showEdges ? "Hide" : "Show"} Edges
              </Switch.Label>
              <Switch
                checked={showEdges}
                onChange={setShowEdges}
                className={`${showEdges ? "bg-teal-900" : "bg-white-700"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">
                  {showEdges ? "Hide" : "Show"} Edges
                </span>
                <span
                  aria-hidden="true"
                  className={`${showEdges ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </Switch.Group>
          <Switch.Group>
            <div className="flex items-center mt-4">
              <Switch.Label
                className={`mr-4 capitalize ${
                  appTheme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {appTheme} Theme
              </Switch.Label>
              <Switch
                checked={appTheme === "dark"}
                onChange={() =>
                  appTheme === "dark"
                    ? setAppTheme("light")
                    : setAppTheme("dark")
                }
                className={`${
                  appTheme === "dark" ? "bg-teal-900" : "bg-white-700"
                }
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">{appTheme} Theme</span>
                <span
                  aria-hidden="true"
                  className={`${
                    appTheme === "dark" ? "translate-x-9" : "translate-x-0"
                  }
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
        <div>
          {data && Object.keys(data).includes("nodes") && (
            <p>Total Node Count: {data["nodes"].length}</p>
          )}
          {data && Object.keys(data).includes("links") && (
            <p>Total Link Count: {linkSize}</p>
          )}
          {data && Object.keys(data).includes("nodes") && (
            <p>
              Displayed Node Count:{" "}
              {
                data["nodes"].filter(
                  (node) =>
                    node.group.name === selectedGroupId ||
                    (node.group.id === selectedGroupId && node)
                ).length
              }
            </p>
          )}
          {data && Object.keys(data).includes("links") && selectedGroupId && (
            <p>
              Displayed Links Count:{" "}
              {Number.isInteger(Number(selectedGroupId)) &&
              data["links"][Number(selectedGroupId)]
                ? data["links"][Number(selectedGroupId)].length
                : 0}
            </p>
          )}
        </div>
        <div>
          <p>Groups: </p>
          <DropDownMenu
            data={dataGroups}
            selected={selectedGroupId}
            setSelected={setSelectedGroupId}
          />
        </div>
      </div>
    </div>
  );
};
export default Widget;
