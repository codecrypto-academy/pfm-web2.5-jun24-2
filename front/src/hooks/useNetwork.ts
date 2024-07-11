import { NetworkCreate } from "../interfaces/networkCreate";
import { useAppContext } from "./useAppContext";
export const useNetwork = () => {
  const { closeModalDeleteNetwork, loader, setLoader, networkId } = useAppContext();

  const createNetwork = async (network: NetworkCreate) => {
    try {
      console.log("Sending network data:", network);
      await fetch("http://localhost:3000/api/network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },        
        body: JSON.stringify(network),
      });
    } catch (error:any) {
      console.error(error.message);
    }
  };

  const stopNetwork = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/network/${id}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "myNetworkId",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const startNetwork = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/network/${id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "myNetworkId",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNetwork = async () => {
    try {
      setLoader("ON");
      await fetch(`http://localhost:3000/api/network/${networkId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      });
      setTimeout(() => {
        setLoader("SUCCESS");
      }, 1500);
      setTimeout(() => {
        closeModalDeleteNetwork();
      }, 3500);
      console.log({ networkId });
    } catch (error) {
      console.error(error);
    }
  };

  const restartNetwork = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/network/${id}/restart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createNetwork,
    startNetwork,
    closeModalDeleteNetwork,
    stopNetwork,
    deleteNetwork,
    loader,
    setLoader,
    restartNetwork,
    networkId,
  };
};
