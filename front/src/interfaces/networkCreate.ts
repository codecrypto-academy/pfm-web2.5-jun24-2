interface Allocation {
  address: string;
  balance: string;
}

interface Node {
  name: string;
  type: string;
  ip: string;
  port?: number;
}

interface NetworkCreate {
  id: string;
  chainId: number;
  subnet: string;
  alloc: Allocation[];
  nodes: Node[];
}

export type { Allocation, Node, NetworkCreate };