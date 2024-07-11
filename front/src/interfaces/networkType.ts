
interface NodesType {
  Name: string;
  Status: string;
  State: string;
  IPAddress: string;
  Id: string;
}

interface Network {
  NetworkName: string;
  State: string;
  NetworkID: string;
  Gateway: string;
  IPAddress: string;
  Nodes: NodesType[];
}

export type { NodesType, Network };
