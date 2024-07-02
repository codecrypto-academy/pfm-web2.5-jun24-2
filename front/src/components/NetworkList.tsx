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
      <table className="table table-dark table-striped" >
        <thead>
          <tr>
            <th class="pr-5">Options </th>
            <th class="pr-5">Status </th>
            <th class="pr-5">ID </th>
            <th class="pr-5">Chain </th>
            <th class="pr-5">Subnet </th>
            <th class="pr-5">Bootnode </th>
          </tr>
        </thead>
        <tbody>
          {networks.map((network, index) => (
            <tr key={index}>
              <td scope="row">
                <button className="btn btn-info btn-sm m-1" onClick={handleAdd} >
                  Add
                </button>
                
                <button className="btn btn-secondary btn-sm m-1"  >
                  Operations
                </button>
                <button
                  className="btn btn-danger btn-sm m-1"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
              <td>{network.status}</td>
              <td>{network.id}</td>
              <td>{network.chain}</td>
              <td>{network.subnet}</td>
              <td>{network.bootnode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  