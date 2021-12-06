export type Node = {
  id: string;
  position: number[];
  group: any;
  color: string;
};

export type LinkType = {
  source: string;
  target: string;
  value: number;
};

export type GraphLink = {
  source: {
    id: string;
    position: number[];
    group: string;
  };
  target: {
    id: string;
    position: number[];
    group: string;
  };
};

export type GraphDataType = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<LinkType>;
};
