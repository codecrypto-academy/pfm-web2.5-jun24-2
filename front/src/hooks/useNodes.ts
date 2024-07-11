import { useState } from "react";
import { useAppContext } from "./useAppContext";
import { NodesType } from "../interfaces/networkType";
import { ApiError } from "../interfaces/ApiError";

export const useNodes = (idNetwork: string) => {
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
  const [typeLoader, setTypeLoader] = useState<string>("");
  const [errorAPI, setErrorAPI] = useState<ApiError | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  const apiCall = async (
    url: string,
    method: string,
    type: string,
    nodeId: string,
    body: unknown = null
  ) => {
    try {
      setLoader("ON");
      setTypeLoader(type);
      setCurrentNodeId(nodeId);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorObject: ApiError = JSON.parse(errorText);
        setErrorAPI(errorObject);
        setLoader("OFF");
        setTypeLoader("");
        setCurrentNodeId(null);
        return response;
      }

      setLoader("OFF");
      setTypeLoader("");
      setCurrentNodeId(null);
      return response;
    } catch (error) {
      console.error(error);
      setErrorAPI({ error: (error as Error).message, type: "API_CALL" });
      setLoader("OFF");
      setTypeLoader("");
      setCurrentNodeId(null);
      throw error;
    }
  };

  const getNodes = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/network/${id}/nodes`);
      if (!res.ok) {
        const errorText = await res.text();
        const errorObject: ApiError = JSON.parse(errorText);
        setErrorAPI(errorObject);
        throw errorObject;
      }
      const nodes: NodesType[] = await res.json();
      setNodes(nodes);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      setErrorAPI({ error: (error as Error).message, type: "GET_NODES" });
    }
  };

  const startNode = async (id: string, type: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/node/${id}/start`,
        "POST",
        type,
        id
      );
      await getNodes(idNetwork);
    } catch (error) {
      console.error("Error starting node:", error);
      setErrorAPI({ error: (error as Error).message, type: "START_NODE" });
    }
  };

  const stopNode = async (id: string, type: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/node/${id}/stop`,
        "POST",
        type,
        id
      );
      await getNodes(idNetwork);
    } catch (error) {
      console.error("Error stopping node:", error);
      setErrorAPI({ error: (error as Error).message, type: "STOP_NODE" });
    }
  };

  const restartNode = async (id: string, type: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/node/${id}/restart`,
        "POST",
        type,
        id
      );
      await getNodes(idNetwork);
    } catch (error) {
      console.error("Error restarting node:", error);
      setErrorAPI({ error: (error as Error).message, type: "RESTART_NODE" });
    }
  };

  const deleteNode = async () => {
    try {
      await apiCall(
        `http://localhost:3000/api/node/${nodeId}`,
        "DELETE",
        "",
        nodeId
      );
      await getNodes(idNetwork);
      closeModalDeleteNode();
    } catch (error) {
      console.error("Error deleting node:", error);
      setErrorAPI({ error: (error as Error).message, type: "DELETE_NODE" });
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
    typeLoader,
    errorAPI,
    setErrorAPI,
    currentNodeId,
  };
};
