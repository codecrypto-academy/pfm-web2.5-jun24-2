import { createContext, useMemo, useState } from "react";
import { AppProviderProps, AppContextType } from "../interfaces/AppContextType";
import { Network, NodesType } from "../interfaces/networkType";

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: AppProviderProps) => {
  const [account, setAccount] = useState<string>("");
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [nodes, setNodes] = useState<NodesType[]>([]);
  const [loader, setLoader] = useState("OFF");

  const openModalDelete = () => {
    setIsModalDelete(true);
  };

  const closeModalDelete = () => {
    setIsModalDelete(false);
  };

  const value = useMemo(
    () => ({
      isModalDelete,
      openModalDelete,
      closeModalDelete,
      loader,
      setLoader,
      networks,
      setNetworks,
      nodes,
      setNodes,
      account,
      setAccount,
    }),
    [isModalDelete, loader, networks, nodes, account]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
