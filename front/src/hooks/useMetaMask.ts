import { useState } from "react";

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

export const useMetaMask = () => {
  const [account, setAccount] = useState<string>("");
  
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };


  return {
    account,
    connectMetaMask,
    setAccount,
  };
};
