import { read } from "fs";
import { AppContext, AppContextProps } from "hooks/useApp";
import useSessionStorage from "hooks/useSessionStorage";
import * as React from "react";
import Dropzone from "react-dropzone";

interface IDropZone {
  setGraphData: (val: any) => void;
  setDim: (val: 3 | 2) => void;
}
interface Event<T = EventTarget> {
  target: T;
}
const DropZone: React.FC<IDropZone> = ({ setGraphData, setDim }) => {
  const {
    setLoading,
    appTheme,
    setData,
    setFileNames,
    fileNames,
    setCurrentFileName,
  } = React.useContext<AppContextProps>(AppContext);

  const [cachedData, setCachedData] = useSessionStorage<Record<string, any>>(
    "cachedData",
    {}
  );

  function handleFileSelect(evt: Event<HTMLInputElement>) {
    setLoading(true);
    var files = evt.target.files; // FileList object

    if (files) {
      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var i = 0, f; (f = files[i]); i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile: File) {
          return function (e: any) {
            console.log("theFile.name = ", theFile);
            try {
              const json = JSON.parse(e.target.result);
              console.log("json: ", json);
              console.log("fileNames: ", fileNames);
              if (fileNames.length > 0) {
                const currentFileNames = fileNames;
                currentFileNames.push(theFile.name);
                setFileNames(currentFileNames);
                console.log("current file names: ", currentFileNames);
              } else {
                setFileNames([theFile.name]);
              }
              setCurrentFileName(theFile.name);

              if (theFile.name.includes("2d")) {
                setDim(2);
              } else {
                setDim(3);
              }
              setCachedData({ [theFile.name]: JSON.stringify(json) });
              setData(json);
              setGraphData(json);
            } catch (ex) {
              alert("ex when trying to parse json = " + ex);
            }
            setLoading(false);
          };
        })(f);
        reader.readAsText(f);
      }
    }
  }
  return (
    <input
      type="file"
      className={`${appTheme === "dark" ? "text-white" : "text-black"}`}
      id="files"
      name="files[]"
      multiple
      onChange={handleFileSelect}
    />
  );
};
export default DropZone;
