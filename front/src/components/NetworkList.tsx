import { useState } from "react";
/* 
Definición del componente NetworList, define las caracteristicas de la red 
*/
 export function NetworkList() {
    const [networks, setNetworks] = useState([
      {
        id: "",
        status: "",
        chain: "",
        subnet: "",
        bootnode: "",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "",
        bootnode: "",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "",
        bootnode: "",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "",
        bootnode: "",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "",
        bootnode: "",
      },
    ]);
 /*
 Definición de botones para añadir y borrar de la lista de NetworkList
 */
    const handleDelete = (index) => {
      const newNetworks = networks.filter((_, i) => i !== index);
      setNetworks(newNetworks);
    };
    
   
    const handleAdd = () => {
      const newNetwork = {
          id: "",
          status: "",
          chain: "",
          subnet: "",
          bootnode: "",

      };
      setNetworks([...networks, newNetwork]);
    };
 
  
    return (
      <table className="min-w-full divide-y divide-gray-200" >
        <thead>
          <tr>
            <th className="pr-5">Options </th>
            <th className="pr-5">Status </th>
            <th className="pr-5">ID </th>
            <th className="pr-5">Chain </th>
            <th className="pr-5">Subnet </th>
            <th className="pr-5">Bootnode </th>
          </tr>
        </thead>
        <tbody className="bg-#155163 divide-y divide-gray-200">
          {networks.map((network, index) => (
            <tr key={index}>
              <td scope="row">
                <button className="bg-green-500 border-green-500 border-2 text-white text-sm px-4 py-2 rounded m-1" onClick={handleAdd} >
                  Add
                </button>
                
                <button className="bg-white border-black border-2 text-black text-sm px-4 py-2 rounded m-1"  >
                  Operations
                </button>
                <button
                  className="bg-red-500 border-red-500 border-2 text-white text-sm px-4 py-2 rounded m-1"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 ">{network.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 ">{network.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 ">{network.chain}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 ">{network.subnet}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 ">{network.bootnode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  