import { createContext, useMemo, useState } from "react";
import { AppProviderProps, AppContextType } from "../interfaces/AppContextType";
import { Network, NodesType } from "../interfaces/networkType";

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: AppProviderProps) => {
  const [account, setAccount] = useState<string>("");
  const [networks, setNetworks] = useState<Network[]>([]);
  const [nodeId, setNodeId] = useState<string>("");
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [nodes, setNodes] = useState<NodesType[]>([]);
  const [loader, setLoader] = useState("OFF");
  const [networkId, setNetworkId] = useState<string>("");

  const openModalDeleteNetwork = (id: string) => {
    setNetworkId(id);
    setIsModalDelete(true);
  };

  const closeModalDeleteNetwork = () => {
    setNetworkId("");
    setIsModalDelete(false);
  };

  const openModalDeleteNode = (id: string) => {
    setNodeId(id);
    setIsModalDelete(true);
  };

  const closeModalDeleteNode = () => {
    setNodeId("");
    setIsModalDelete(false);
  };

  const value = useMemo(
    () => ({
      isModalDelete,
      openModalDeleteNetwork,
      closeModalDeleteNetwork,
      loader,
      setLoader,
      networks,
      setNetworks,
      nodes,
      setNodes,
      account,
      setAccount,
      networkId,
      setNetworkId,
      nodeId,
      setNodeId,
      openModalDeleteNode,
      closeModalDeleteNode,
    }),
    [isModalDelete, loader, networks, nodes, account, networkId, nodeId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
