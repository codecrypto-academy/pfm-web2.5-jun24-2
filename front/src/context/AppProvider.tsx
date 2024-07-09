import { createContext, useMemo, useState, useEffect } from "react";
import { AppProviderProps, AppContextType } from "../interfaces/AppContextType";
import { Network } from "../interfaces/networkType";

const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: AppProviderProps) => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
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
    }),
    [isModalDelete, loader, networks]
  );

  // Configuración inicial de networks
  useEffect(() => {
    const initialNetworks: Network[] = Object.values({
      "36aa9f5db4c36bc13129dfd366b4ff531e5e733e7cf7c2a6cd8fb7c16b2ab993": {
        NetworkName: "eth-network-02",
        NetworkID:
          "36aa9f5db4c36bc13129dfd366b4ff531e5e733e7cf7c2a6cd8fb7c16b2ab993",
        Gateway: "172.18.0.1",
        IPAddress: "172.18.0.2",
        Nodes: [
          {
            Name: "/my-eth-node",
            Status: "Up 54 seconds",
            State: "running",
            IPAddress: "172.18.0.2",
          },
        ],
      },
      df9948f714c6b62f83e218041b7714c0aa537118c48fe92216c384a40b345d87: {
        NetworkName: "bridge",
        NetworkID:
          "df9948f714c6b62f83e218041b7714c0aa537118c48fe92216c384a40b345d87",
        Gateway: "172.17.0.1",
        IPAddress: "172.17.0.2",
        Nodes: [
          {
            Name: "/eth-node-01",
            Status: "Up About a minute",
            State: "running",
            IPAddress: "172.17.0.2",
          },
        ],
      },
    }) as Network[];
    setNetworks(initialNetworks);
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
