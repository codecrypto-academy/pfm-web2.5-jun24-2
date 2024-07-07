export const useNetwork = () => {
  const createNetwork = () => {
    fetch("http://localhost:3000/api/network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "myNetworkId",
        chainId: "1234",
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
            port: 30305,
            rpcPort: 8548,
            type: "miner",
          },
        ],
      }),
    });
  };

  return {
    createNetwork,
  };
};