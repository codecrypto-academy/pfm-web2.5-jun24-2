import { useState } from "react";
import { ApiError } from "../interfaces/ApiError";
import { Network } from "../interfaces/networkType";
import { useAppContext } from "./useAppContext";
import { useApiCall } from "./useApiCall";
import { NetworkCreate } from "../interfaces/networkCreate";

export const useNetwork = () => {
  const {
    closeModalDeleteNetwork,
    loader,
    setLoader,
    networkId,
    setNetworks,
  } = useAppContext();
  const [errorAPI, setErrorAPI] = useState<ApiError | null>(null);
  const { apiCall, loaderButton, typeLoader, currentNetworkId } = useApiCall();

  const handleApiError = (error: unknown, type: string) => {
    console.error(`Error ${type.toLowerCase()} network:`, error);
    if (error instanceof Error) {
      setErrorAPI({ error: error.message, type });
    } else {
      setErrorAPI({ error: "An unexpected error occurred", type });
    }
    throw error;
  };

  const getNetworks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/networks");
      if (!response.ok) {
        const errorText = await response.text();
        const errorObject: ApiError = JSON.parse(errorText);
        throw errorObject;
      }
      const data: { [key: string]: Network } = await response.json();
      setNetworks(Object.values(data));
    } catch (error) {
      handleApiError(error, "GET_NETWORK");
    }
  };

  const createNetwork = async (network: NetworkCreate) => {
    try {
      await apiCall(
        "http://localhost:3000/api/network",
        "POST",
        "CREATE",
        "",
        network
      );
      await getNetworks();
    } catch (error) {
      handleApiError(error, "CREATE_NETWORK");
    }
  };

  const stopNetwork = async (id: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/network/${id}/stop`,
        "POST",
        "DOWN",
        id,
        { id }
      );
      await getNetworks();
    } catch (error) {
      handleApiError(error, "STOP_NETWORK");
    }
  };

  const startNetwork = async (id: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/network/${id}/start`,
        "POST",
        "UP",
        id,
        { id }
      );
      await getNetworks();
    } catch (error) {
      handleApiError(error, "START_NETWORK");
    }
  };

  const deleteNetwork = async () => {
    try {
      await apiCall(
        `http://localhost:3000/api/network/${networkId}`,
        "DELETE",
        "DELETE",
        networkId
      );
      await getNetworks();
      closeModalDeleteNetwork();
    } catch (error) {
      handleApiError(error, "DELETE_NETWORK");
    }
  };

  const restartNetwork = async (id: string) => {
    try {
      await apiCall(
        `http://localhost:3000/api/network/${id}/restart`,
        "POST",
        "RESTART",
        id
      );
      await getNetworks();
    } catch (error) {
      handleApiError(error, "RESTART_NETWORK");
    }
  };

  return {
    createNetwork,
    startNetwork,
    stopNetwork,
    deleteNetwork,
    restartNetwork,
    loader,
    setLoader,
    loaderButton,
    typeLoader,
    errorAPI,
    setErrorAPI,
    currentNetworkId,
  };
};
