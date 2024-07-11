import { ReactNode } from "react";
import { Network, NodesType } from "./networkType";

interface AppContextType {
  isModalDelete: boolean;
  openModalDeleteNetwork: (id: string) => void;
  closeModalDeleteNetwork: () => void;
  openModalDeleteNode: (id: string) => void;
  closeModalDeleteNode: () => void;
  loader: string;
  networks: Network[];
  nodes: NodesType[];
  account: string;
  networkId: string;
  nodeId: string;
  loaderButton : string;
  setLoaderButton : (value: string) => void;
  setNodeId: (value: string) => void;
  setNetworkId: (value: string) => void;
  setAccount: (value: string) => void;
  setNodes: (value: NodesType[]) => void;
  setNetworks: (value: Network[]) => void;
  setLoader: (value: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

export type { AppContextType, AppProviderProps };
