import { useAppContext } from "./useAppContext";

export const useNetwork = () => {
  const { closeModalDelete, loader, setLoader } = useAppContext();

  const createNetwork = async () => {
    try {
      await fetch("http://localhost:3000/api/network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "network333",
          chainId: 2222,
          subnet: "192.168.100.0/24",
          alloc: [
            {
              address: "0x03A809f5AB398E113017286aC9B7Ce2B7ACCa65b",
              balance: "100000000000000000000",
            },
          ],
          nodes: [
            {
              name: "node1",
              type: "miner",
              ip: "192.168.100.2",
              port: 9999,
            },
            {
              name: "node2",
              type: "rpc",
              ip: "192.168.100.3",
            },
            {
              name: "node3",
              type: "miner",
              ip: "192.168.100.4",
            },
          ],
        }),
      });
    } catch (error) {
      console.error(error);
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
    closeModalDelete,
    stopNetwork,
    deleteNetwork,
    loader,
    setLoader,
    restartNetwork,
  };
};
