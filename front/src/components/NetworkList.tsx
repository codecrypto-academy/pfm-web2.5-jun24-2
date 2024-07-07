import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import EditNetwork from "./EditNetwork";
import { Network } from "./Network";

const fetchNetworks = async () => {
  const { data } = await axios.get("http://localhost:3000/api/networks");
  return data;
};

export const ListNetworks: React.FC = ({ setMenuItems }) => {
 /* const { data, error, isLoading } = useQuery({
    queryKey: ['networks'],
    queryFn: fetchNetworks
  });
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const networkArray = Object.values(data);
      setNetworks(networkArray);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // const handleAdd = async () => {    

  //Agregar Network
  // const network:Network = {} 
  // await addNetwork({network});

  //   const nets = await fetchNetworks();
  //   setNetworks([networks, nets]);    
  // };

  const [showEdit, setShowEdit] = useState(false);
  const [nets, setNets] = useState<any[]>([]);

  const toggleEdit = () => {
    setShowEdit(true);
  };
  if (showEdit) {
    return <EditNetwork />
  }

  const handleDelete = (index: number) => {
    const newNetworks = networks.filter((_, i) => i !== index);
    setNetworks(newNetworks);
  };

  return (
    <>
    <button className="bg-[#32e4f0] h-8 text-black w-36 rounded m-1" onClick={toggleEdit}>Add Network</button>
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="pr-5 text-white">Options </th>
          <th className="pr-5 text-white">Network Name </th>          
          <th className="pr-5 text-white">Gateway </th>
          <th className="pr-5 text-white">IP Address </th>
          <th className="pr-5 text-white">Nodes</th>
        </tr>
      </thead>
      <tbody className="bg-#155163 divide-y divide-gray-200">
        {networks.map((network, index) => (
          <tr key={index}>
            <td scope="row">
            <button className="bg-white text-black text-sm px-4 py-2 rounded m-1">
                Faucet
              </button>
              <button className="bg-green-500 green-500  text-white text-sm px-4 py-2 rounded m-1">
                UP
              </button>
              <button className="bg-green-500 green-500  text-white text-sm px-4 py-2 rounded m-1">
                DOWN
              </button>
              <button className="bg-white text-black text-sm px-4 py-2 rounded m-1" onClick={()=> setMenuItems("NODE")} >
                Nodes
              </button>
              <button
                className="bg-red-500 red-500  text-white text-sm px-4 py-2 rounded m-1"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border border-gray-300">
              {network.NetworkName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border border-gray-300 hidden">
              {network.NetworkID}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border border-gray-300">
              {network.Gateway}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border border-gray-300">
              {network.IPAddress}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border border-gray-300">
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
