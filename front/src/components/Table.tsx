import { Network, NodesType } from "../interfaces/networkType";
import { useNetwork } from "../hooks/useNetwork";
import { useAppContext } from "../hooks/useAppContext";
import { Link } from "react-router-dom";

export const Table = ({ networks }: { networks: Network[] }) => {
  const { stopNetwork, startNetwork, restartNetwork } = useNetwork();
  const { openModalDeleteNetwork } = useAppContext();



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
              className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
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
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {network.NetworkName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {network.IPAddress}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {network.State}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex w-60 flex-wrap justify-center items-center gap-3">
                <button
                  className="bg-[#32e4f0] w-24 h-11 text-white"
                  onClick={() => handleStartNetwork(startNetwork, network)}
                >
                  UP
                </button>
                <button
                  className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24"
                  onClick={() => restartNetwork(network.NetworkID)}
                >
                  RESTART
                </button>
                <button
                  className="bg-[#32e4f0] w-24 h-11 text-white"
                  onClick={() => stopNetwork(network.NetworkID)}
                >
                  DOWN
                </button>
                <button
                  className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24"
                  onClick={() => openModalDeleteNetwork(network.NetworkID)}
                >
                  DELETE
                </button>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <ul className="mb-4">
                {network.Nodes.map((node: NodesType) => (
                  <li key={node.Id}>
                    <p
                    className="font-bold"
                    >{node.Name}</p>
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
      </table>
    </div>
  );
};

async function handleStartNetwork(startNetwork: (id: string) => Promise<void>, network: Network): Promise<void> {
  await startNetwork(network.NetworkID);
}

