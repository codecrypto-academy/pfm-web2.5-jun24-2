import { useAppContext } from "./useAppContext";

export const useNodes = () => {
  const { setNodes, nodes } = useAppContext()

  const startNode = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/node/${id}/start`, {
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
  const stopNode = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/node/${id}/stop`, {
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

  const restartNode = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/node/${id}/restart`, {
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

  const getNodes = async (id: string) => {
    try {
       const res = await fetch(
        `http://localhost:3000/api/network/${id}/nodes`
      );
      const nodes = await res.json();
      setNodes(nodes);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    startNode,
    stopNode,
    restartNode,
    getNodes,
    nodes,
  };
};
