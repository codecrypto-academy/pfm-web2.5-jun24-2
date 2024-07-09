import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import EditNetwork from "./EditNetwork";
import { Network } from "./Network";
import { FcExternal } from "react-icons/fc";
import { FcInternal } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import { FaFaucet } from "react-icons/fa";
import { GrNodes } from "react-icons/gr";


const fetchNetworks = async () => {
  const { data } = await axios.get('http://localhost:3000/api/networks');
  console.log(data); // Muestra los datos en la consola
  return data;
};

// const addNetwork = async (network: Network) => {
//   const { data } = await axios.post('http://localhost:3000/api/network/',{network});
//   return data;
// };

export const ListNetworks: React.FC = ({ setMenuItems }) => {
 /* const { data, error, isLoading } = useQuery({
    queryKey: ['networks'],
    queryFn: fetchNetworks
  });*/
  let data = {
    "57a7e0fe67d1f4fb35da7b79f1431de6975b7d9e156c207c0db7d76e0ea52b04": {
        "NetworkName": "bridge",
        "NetworkID": "57a7e0fe67d1f4fb35da7b79f1431de6975b7d9e156c207c0db7d76e0ea52b04",
        "Gateway": "172.17.0.1",
        "IPAddress": "172.17.0.2",
        "Nodes": [
            {
                "Name": "/eth-node-01",
                "Status": "Up 5 minutes",
                "State": "running",
                "IPAddress": "172.17.0.2"
            }
        ]
    }
}
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    console.log({data})
    if (data) {
      const networkArray = Object.values(data);
      setNetworks(networkArray);
    }
  }, []);
//}, [data]);

 // if (isLoading) return <div>Loading...</div>;
//if (error) return <div>Error: {(error as Error).message}</div>;

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
  const handleBack = () => {
    setShowEdit(false);
  };
  if (showEdit) {
    return  <EditNetwork onBack={handleBack} />;
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
              <div>
              <button >
                 <FcExternal size="50px" />
              </button>
              <button >
                <FcInternal size="50px" color="red" />
              </button>
              </div>
              <div>
              <button >
              <FaFaucet size="50px" />
              </button>
              <button  onClick={()=> setMenuItems("NODE")} >
              <GrNodes  size="50px"/>
              </button>
              </div>
              <button
                
                onClick={() => handleDelete(index)}
              >
                <MdDeleteForever size="50px" color="red"/>
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
