import { useEffect } from "react";
import { useNodes } from "../hooks/useNodes";
import { Link, useParams } from "react-router-dom";
import { DeleteNodeModal } from "../components/DeleteNodeModal";

export const Nodes = () => {
  const { id } = useParams<{ id: string }>();
  const {
    startNode,
    stopNode,
    restartNode,
    getNodes,
    nodes,
    openModalDeleteNode,
    isModalDelete,
  } = useNodes();

  useEffect(() => {
    if (!id) return;
    getNodes(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    {isModalDelete && <DeleteNodeModal />}
    <div className="bg-[#155163] min-h-screen flex justify-center items-center flex-col">
      <h3 className="text-white text-5xl font-semibold mt-8 mb-8">NODES</h3>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Ip Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {nodes.map((node) => (
                    <tr key={node.Id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {node.Name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.IPAddress}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.Status}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {node.State}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex w-60 flex-wrap justify-center items-center gap-3">
                        <button
                          className="bg-[#32e4f0] w-24 h-11 text-white"
                          onClick={() => startNode(node.Id)}
                        >
                          UP
                        </button>
                        <button
                          className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24"
                          onClick={() => openModalDeleteNode(node.Id)}
                        >
                          DELETE
                        </button>
                        <button
                          className="bg-[#32e4f0] w-24 h-11 text-white"
                          onClick={() => stopNode(node.Id)}
                        >
                          DOWN
                        </button>
                        <button
                          className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24"
                          onClick={() => restartNode(node.Id)}
                        >
                          RESTART
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Link
        to="/methods"
        className="bg-[#32e4f0] h-11 text-white mt-7 p-2 w-96 text-center"
      >
        BACK TO NETWORKS
      </Link>
    </div>
    </>
  );
};
