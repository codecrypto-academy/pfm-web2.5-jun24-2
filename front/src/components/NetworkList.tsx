import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import { Network, NodesType } from "../interfaces/networkType";
import { FcExternal, FcInternal } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import EditNetwork from "./EditNetwork";
import FaucetIcon from "../assets/icons8-faucet-90.svg";
import NodesIcon from "../assets/icons8-nodes-60.svg";

const fetchNetworks = async () => {
  const { data } = await axios.get("http://localhost:3000/api/networks");
  return data;
};

export const ListNetworks: React.FC = ({ setMenuItems }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["networks"],
    queryFn: fetchNetworks,
  });
  const [showEdit, setShowEdit] = useState(false);
  const { stopNetwork, startNetwork, restartNetwork } = useNetwork();

  const { openModalDelete, setNetworks, networks } = useAppContext();

  useEffect(() => {
    if (!data) return;

    const networkArray: Network[] = Object.values(data);

    setNetworks(networkArray);
  }, [data, setNetworks]);

  if (isLoading) return <div>Loading...</div>;

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
                  <button onClick={()=> setMenuItems("FAUCET")}>
                    <img src={FaucetIcon} alt="" className="w-10" />
                  </button>
                  <Link to={`/nodes/${network.NetworkID}`}>
                    <button>
                      <img src={NodesIcon} alt="" className="w-10" />
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
    </>
  );
};
