import { ReactNode } from "react";
import { Network } from "./networkType";

interface AppContextType {
  isModalDelete: boolean;
  openModalDelete: () => void;
  closeModalDelete: () => void;
  loader: string;
  networks: Network[];
  setNetworks: (value: Network[]) => void;
  setLoader: (value: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

export type { AppContextType, AppProviderProps };
