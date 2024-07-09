import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";

const fetchNetworks = async () => {
  const { data } = await axios.get('http://localhost:3000/api/networks');
  console.log(data); // Muestra los datos en la consola
  return data;
};

// const addNetwork = async (network: Network) => {
//   const { data } = await axios.post('http://localhost:3000/api/network/',{network});
//   return data;
// };

export const ListNetworks: React.FC = () => {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['networks'],
  //   queryFn: fetchNetworks
  // });
  const { stopNetwork, startNetwork } = useNetwork();
  const { openModalDelete, setNetworks, networks } = useAppContext();


  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {(error as Error).message}</div>;

  // const handleAdd = async () => {    

  //Agregar Network
  // const network:Network = {} 
  // await addNetwork({network});

  //   const nets = await fetchNetworks();
  //   setNetworks([networks, nets]);    
  // };

  const handleDelete = (index: number) => {
    const newNetworks = networks.filter((_, i) => i !== index);
    setNetworks(newNetworks);
  };
const id = "36aa9f5db4c36bc13129dfd366b4ff531e5e733e7cf7c2a6cd8fb7c16b2ab993"
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
          {networks.map((network, index) => (
            <tr key={index}>
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
                <Link to={`/nodes/${id}`}>
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
                {network.Nodes.map((node: any, nodeIndex: number) => (
                  <div key={nodeIndex}>
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
