import { Network, NodesType } from "../interfaces/networkType";
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";
import { Loader } from "./Loader";
import { useEffect } from "react";

export const Table = ({ networks }: { networks: Network[] }) => {
  const {
    stopNetwork,
    startNetwork,
    restartNetwork,
    loaderButton,
    typeLoader,
    currentNetworkId,
    errorAPI,
    setErrorAPI,
  } = useNetwork();
  const { openModalDeleteNetwork } = useAppContext();

  const validateLoader = (type: string, networkId: string, text: string) => {
    if (
      typeLoader === type &&
      loaderButton === "ON" &&
      currentNetworkId === networkId
    ) {
      return <Loader />;
    }
    return text;
  };

  const handleStartNetwork = async (network: Network) => {
    await startNetwork(network.NetworkID);
  };

  const handleStopNetwork = async (network: Network) => {
    await stopNetwork(network.NetworkID);
  };

  const handleRestartNetwork = async (network: Network) => {
    await restartNetwork(network.NetworkID);
  };

  useEffect(() => {
    if (!errorAPI) return;
    console.log("errorAPI");
    setTimeout(() => {
      setErrorAPI(null);
    }, 2000);
  }, [errorAPI, setErrorAPI]);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg w-[1000px]">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 m-auto"
            >
              Ip Address
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              Actions
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              Nodes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {networks.map((network: Network, index: number) => (
            <tr key={`${network.NetworkName}_${index}`}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                {network.NetworkName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                {network.IPAddress}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                {network.State}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex w-60 flex-wrap justify-center items-center gap-3 m-auto">
                <button
                  className="bg-[#32e4f0] w-24 h-11 text-white"
                  onClick={() => handleStartNetwork(network)}
                >
                  {validateLoader("UP", network.NetworkID, "UP")}
                </button>
                <button
                  className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24"
                  onClick={() => handleRestartNetwork(network)}
                >
                  {validateLoader("RESTART", network.NetworkID, "RESTART")}
                </button>
                <button
                  className="bg-[#32e4f0] w-24 h-11 text-white"
                  onClick={() => handleStopNetwork(network)}
                >
                  {validateLoader("DOWN", network.NetworkID, "DOWN")}
                </button>
                <button
                  className="bg-red-700 border-2 border-red-950 text-white h-11 w-24"
                  onClick={() => openModalDeleteNetwork(network.NetworkID)}
                >
                  DELETE
                </button>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <ul className="mb-4">
                  {network.Nodes.map((node: NodesType) => (
                    <li key={node.Id}>
                      <p className="font-bold">{node.Name}</p>
                    </li>
                  ))}
                </ul>
                <Link to={`/nodes/${network.NetworkID}`}>
                  <button className="bg-[#32e4f0] h-11 text-white justify-center flex items-center flex-col text-center m-auto w-[100%]">
                    VIEW NODES
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        {errorAPI && errorAPI.type !== "CREATE" ? (
          <tfoot className="divide-y divide-gray-200 bg-white">
            <tr>
              <td
                colSpan={5}
                className="text-red-500 text-center py-4 font-bold"
              >
                {JSON.parse(errorAPI.error).error}
              </td>
            </tr>
          </tfoot>
        ) : (
          <></>
        )}
      </table>
    </div>
  );
};
