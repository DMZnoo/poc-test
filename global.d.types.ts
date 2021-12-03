export type Node = {
  id: string;
  position: number[];
  group: {
    id?: string;
    name?: string;
    positions: number[];
  };
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
    group: {
      id: string;
    };
  };
  target: {
    id: string;
    position: number[];
    group: {
      id: string;
    };
  };
};

export type GraphDataType = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<LinkType[]>;
};
