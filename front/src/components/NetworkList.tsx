// Definición del componente NetworkList que gestiona la lista de redes
import { useState } from "react";

 export function NetworkList() {
    const [networks, setNetworks] = useState([
      {
        id: "",
        status: "",
        chain: "",
        subnet: "172.16.200.0/24",
        bootnode: "172.16.200.10",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "172.16.100.0/24",
        bootnode: "172.16.100.10",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "172.16.100.0/24",
        bootnode: "172.16.100.10",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "172.16.100.0/24",
        bootnode: "172.16.100.10",
      },
      {
        id: "",
        status: "",
        chain: "",
        subnet: "172.16.200.0/24",
        bootnode: "172.16.200.10",
      },
    ]);

    const handleDelete = (index) => {
      const newNetworks = networks.filter((_, i) => i !== index);
      setNetworks(newNetworks);
    };
    
   
    const handleAdd = () => {
      const newNetwork = {
          id: "",
          status: "",
          chain: "",
          subnet: "172.16.200.0/24",
          bootnode: "172.16.200.10",

      };
      setNetworks([...networks, newNetwork]);
    };
 
  
    return (
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Options</th>
            <th>Status</th>
            <th>ID</th>
            <th>Chain</th>
            <th>Subnet</th>
            <th>Bootnode</th>
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
  