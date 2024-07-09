import { useAppContext } from "./useAppContext";

export const useNetwork = () => {
  const { closeModalDelete, loader, setLoader } = useAppContext();
  const createNetwork = () => {
    fetch("http://localhost:3000/api/network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "myNetworkId",
        chainId: 1122,
        // subnet: "192.168.1.0/24",
        alloc: [
          {
            address: "5147C22982026648A98A9251572C68B79AffC6dE",
            balance: "100000000000000000000",
          },
        ],
        nodes: [
          {
            id: "node1",
            // ip: "192.168.1.2",
            port: 8888,
            type: "miner",
          },
        ],
      }),
    });
  };

  const stopNetwork = (id: string) => {
    fetch(`http://localhost:3000/api/network/${id}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "myNetworkId",
      }),
    });
  };

  const startNetwork = (id: string) => {
    fetch(`http://localhost:3000/api/network/${id}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "myNetworkId",
      }),
    });
  };
  
  const deleteNetwork = async (id: string) => {
    try {
      setLoader("ON");
      setTimeout(() => {
        setLoader("SUCCESS");
      }, 1500);
      setTimeout(() => {
        closeModalDelete();
      }, 3500);
      console.log({ id });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createNetwork,
    startNetwork,
    closeModalDelete,
    stopNetwork,
    deleteNetwork,
    loader,
    setLoader,
  };
};
