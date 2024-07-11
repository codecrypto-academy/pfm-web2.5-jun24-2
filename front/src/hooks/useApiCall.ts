import { useState } from "react";

export const useApiCall = () => {
  const [loaderButton, setLoaderButton] = useState<"ON" | "OFF">("OFF");
  const [typeLoader, setTypeLoader] = useState<string>("");
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null);

  const apiCall = async (
    url: string,
    method: string,
    type: string,
    networkId: string,
    body: unknown = null
  ) => {
    try {
      setLoaderButton("ON");
      setTypeLoader(type);
      setCurrentNetworkId(networkId);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      setLoaderButton("OFF");
      setTypeLoader("");
      setCurrentNetworkId(null);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      return response;
    } catch (error) {
      console.error(error);
      setLoaderButton("OFF");
      setTypeLoader("");
      setCurrentNetworkId(null);
      throw error;
    }
  };

  return { apiCall, loaderButton, typeLoader, currentNetworkId };
};
