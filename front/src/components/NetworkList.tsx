import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import EditNetwork from "./EditNetwork";
import { Network } from "./Network";
import { FcExternal } from "react-icons/fc";
import { FcInternal } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import { FaFaucet } from "react-icons/fa";
import { GrNodes } from "react-icons/gr";

=======
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import { Network, NodesType } from "../interfaces/networkType";
import { FcExternal, FcInternal } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
<<<<<<< HEAD
import EditNetwork from "./EditNetwork";
import FaucetIcon from "../assets/icons8-faucet-90.svg";
import NodesIcon from "../assets/icons8-nodes-60.svg";
<<<<<<< HEAD
>>>>>>> dec2bf0 (icons)
=======
=======
import { FaFaucet } from "react-icons/fa";
import { GrNodes } from "react-icons/gr";
import useConfirm from "../hooks/useConfirm";

>>>>>>> 6777819 (alerta)
>>>>>>> f08e4fb (alerta)

const fetchNetworks = async () => {
  const { data } = await axios.get("http://localhost:3000/api/networks");
  return data;
};

export const ListNetworks: React.FC = ({ setMenuItems }) => {
 /* const { data, error, isLoading } = useQuery({
    queryKey: ['networks'],
    queryFn: fetchNetworks
  });
<<<<<<< HEAD
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const networkArray = Object.values(data);
      setNetworks(networkArray);
    }
  }, [data]);
=======
  const [showEdit, setShowEdit] = useState(false);
  const { stopNetwork, startNetwork, restartNetwork } = useNetwork();

<<<<<<< HEAD
  const { openModalDelete, setNetworks, networks } = useAppContext();
=======
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
>>>>>>> 6777819 (alerta)

  useEffect(() => {
    if (!data) return;

    const networkArray: Network[] = Object.values(data);

    setNetworks(networkArray);
  }, [data, setNetworks]);
>>>>>>> dec2bf0 (icons)

<<<<<<< HEAD
  if (isLoading) return <div>Loading...</div>;
<<<<<<< HEAD
  if (error) return <div>Error: {(error as Error).message}</div>;
=======
=======
  //Agregar Network
  // const network:Network = {} 
  // await addNetwork({network});

  //   const nets = await fetchNetworks();
  //   setNetworks([networks, nets]);    
  // };

  const [showEdit, setShowEdit] = useState(false);
  const [nets, setNets] = useState<any[]>([]);
  const { isOpen, onConfirm, requestConfirm, cancel } = useConfirm();
>>>>>>> 6777819 (alerta)
>>>>>>> f08e4fb (alerta)

<<<<<<< HEAD
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
=======
  if (error) return <div>Error: {error.message}</div>;
  const toggleEdit = () => {
    setShowEdit(true);
  };
  const handleBack = () => {
    setShowEdit(false);
  };
  if (showEdit) {
    return <EditNetwork onBack={handleBack} />;
  }

<<<<<<< HEAD
  return (
    <>
      <button
        className="bg-[#32e4f0] h-8 text-black w-36 rounded m-1"
        onClick={toggleEdit}
      >
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
                <div>
                  <button>
                    <FcExternal
                      size="20px"
                      color="green"
                      onClick={() => startNetwork(network.NetworkID)}
                    />
                  </button>
                  <button>
                    <FcInternal
                      size="20px"
                      color="red"
                      onClick={() => stopNetwork(network.NetworkID)}
                    />
                  </button>
                </div>
                <div>
                  <button>
                    <img src={FaucetIcon} alt="" className="w-10"/>
                  </button>
                  <Link to={`/nodes/${network.NetworkID}`}>
                    <button>
                      <img src={NodesIcon} alt="" className="w-10"/>
                    </button>
                  </Link>
                </div>
                <button>
                  <MdDeleteForever
                    size="20px"
                    color="red"
                    onClick={openModalDelete}
                  />
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
<<<<<<< HEAD
>>>>>>> dec2bf0 (icons)
=======
=======
  const handleDelete = (index: number) => {
    const newNetworks = networks.filter((_, i) => i !== index);
    setNetworks(newNetworks);
  };
  const confirmDelete = (index) => {
    requestConfirm(() => handleDelete(index));
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
                
                onClick={() => confirmDelete(index)}
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
    {isOpen && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 20, backgroundColor: 'white', boxShadow: '0px 0px 15px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          <h4>¿Seguro que quieres borrar?</h4>
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={cancel}>Cancelar</button>
        </div>
      )}
>>>>>>> 6777819 (alerta)
>>>>>>> f08e4fb (alerta)
    </>
  );
};

