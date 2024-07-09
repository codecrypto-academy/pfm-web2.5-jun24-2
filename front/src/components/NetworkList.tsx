import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import { Network, NodesType } from "../interfaces/networkType";

const fetchNetworks = async () => {
  const { data } = await axios.get("http://localhost:3000/api/networks");
  return data;
};

export const ListNetworks: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["networks"],
    queryFn: fetchNetworks,
  });

  const { stopNetwork, startNetwork, restartNetwork } = useNetwork();

  const { openModalDelete, setNetworks, networks } = useAppContext();

  useEffect(() => {
    if (!data) return;

    // const networkArray: Network[] = Object.values(data);
    const networkArray: Network[] = Object.values({
      "85b5f71d15d7b30106b8356ad61d3553f4b98598af1c244052e39f986d0f4a02": {
        NetworkName: "network333",
        NetworkID:
          "85b5f71d15d7b30106b8356ad61d3553f4b98598af1c244052e39f986d0f4a02",
        Gateway: "192.168.100.1",
        IPAddress: "192.168.100.4",
        Nodes: [
          {
            Id: "827f82ce2e40cc51aab9a64277b8bf139d3f940b1075d1cb7b3d96b3ca625d6c",
            Name: "/node-miner_node3",
            Status: "Up 31 seconds",
            State: "running",
            IPAddress: "192.168.100.4",
          },
          {
            Id: "54a9764c7bde346063da6ce39e83e1830ba246bd587be3947ca4702ccac99b1a",
            Name: "/node-rpc_node2",
            Status: "Up 32 seconds",
            State: "running",
            IPAddress: "192.168.100.3",
          },
        ],
      },
      "2a44c355a6bf4ecd96001511de2dff361c8bfd8a689bbf4a12f0bcba5df6fdbf": {
        NetworkName: "bridge",
        NetworkID:
          "2a44c355a6bf4ecd96001511de2dff361c8bfd8a689bbf4a12f0bcba5df6fdbf",
        Gateway: "172.17.0.1",
        IPAddress: "172.17.0.2",
        Nodes: [
          {
            Id: "9dea921cd48f4432f83797019c80f98a4d07be6e955918b4f42596f3c5df1d6c",
            Name: "/eth-node-01",
            Status: "Up 35 minutes",
            State: "running",
            IPAddress: "172.17.0.2",
          },
        ],
      },
    });

    setNetworks(networkArray);
  }, [data, setNetworks]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <button className="bg-green-500 border-green-500 border-2 text-white text-sm px-4 py-2 rounded m-1">
        Add Network
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="pr-5">Options </th>
            <th className="pr-5">Network Name </th>
            <th className="pr-5">Gateway </th>
            <th className="pr-5">IP Address </th>
            <th className="pr-5">Nodes</th>
          </tr>
        </thead>
        <tbody className="bg-[#155163] divide-y divide-gray-200">
          {networks?.map((network: Network, index: number) => (
            <tr key={`${network.NetworkName}_${index}`}>
              <td scope="row">
                <button className="bg-green-500 border-green-500 border-2 text-white text-sm px-4 py-2 rounded m-1">
                  Faucet
                </button>
                <button
                  className="bg-green-500 border-green-500 border-2 text-white text-sm px-4 py-2 rounded m-1"
                  onClick={() => startNetwork(network.NetworkID)}
                >
                  UP
                </button>
                <button
                  className="bg-green-500 border-green-500 border-2 text-white text-sm px-4 py-2 rounded m-1"
                  onClick={() => stopNetwork(network.NetworkID)}
                >
                  DOWN
                </button>
                <Link to={`/nodes/${network.NetworkID}`}>
                  <button className="bg-white border-black border-2 text-black text-sm px-4 py-2 rounded m-1">
                    Nodes
                  </button>
                </Link>
                <button
                  className="bg-red-500 border-red-500 border-2 text-white text-sm px-4 py-2 rounded m-1"
                  onClick={openModalDelete}
                >
                  Delete
                </button>
                <button
                  className="bg-red-500 border-red-500 border-2 text-white text-sm px-4 py-2 rounded m-1"
                  onClick={()=>restartNetwork(network.NetworkID)}
                >
                  Restart
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {network.NetworkName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 hidden">
                {network.NetworkID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {network.Gateway}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {network.IPAddress}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                {network.Nodes.map((node: NodesType, index: number) => (
                  <div key={`${node.Name}_${index}`}>
                    <p>Name: {node.Name}</p>
                    <p>Status: {node.Status}</p>
                    <p>State: {node.State}</p>
                    <p>IP Address: {node.IPAddress}</p>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
