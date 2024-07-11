import { useAppContext } from "./useAppContext";

export const useNodes = () => {
  const {
    setNodes,
    nodes,
    openModalDeleteNode,
    closeModalDeleteNode,
    loader,
    setLoader,
    nodeId,
    isModalDelete,
  } = useAppContext();

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
      const res = await fetch(`http://localhost:3000/api/network/${id}/nodes`);
      const nodes = await res.json();
      setNodes(nodes);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNode = async (id: string) => {
    try {
      setLoader("ON");
      await fetch(`http://localhost:3000/api/node/${nodeId}`, {
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
        closeModalDeleteNode();
      }, 3500);
      getNodes(id);
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
    deleteNode,
    openModalDeleteNode,
    closeModalDeleteNode,
    loader,
    nodeId,
    setLoader,
    isModalDelete,
  };
};
