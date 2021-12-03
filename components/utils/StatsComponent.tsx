import { useFrame } from "@react-three/fiber";
import * as React from "react";
import Stats from "three/examples/jsm/libs/stats.module";

const StatsComponent = () => {
  const [stats, setStats] = React.useState<Stats>();

  React.useEffect(() => {
    const stat = Stats();
    setStats(stat);
    console.log("stat.dom: ", stat.dom);
    document.body.appendChild(stat.dom);
  }, []);

  useFrame(() => {
    if (stats) {
      stats.update();
    }
  });
  return <></>;
};
export default StatsComponent;
