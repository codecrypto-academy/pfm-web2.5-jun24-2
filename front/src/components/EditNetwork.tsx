import { useState } from "react";
import { Allocation, NetworkCreate, Node } from "../interfaces/networkCreate";
import { useNetwork } from "../hooks/useNetwork";
import { Loader } from "./Loader";

const EditNetwork = ({ onBack }: { onBack: () => void }) => {
  const [networkData, setNetworkData] = useState<NetworkCreate>({
    id: "",
    chainId: 0,
    subnet: "",
    alloc: [{ address: "", balance: "" }],
    nodes: [
      { name: "", type: "", ip: "", port: undefined },
      { name: "", type: "", ip: "", port: undefined },
    ],
  });

  const [error, setError] = useState<string | null>(null);
  const { createNetwork, setErrorAPI, errorAPI, typeLoader, loaderButton } =
    useNetwork();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    index?: number
  ) => {
    const value = e.target.value;
    setNetworkData((prevData) => {
      if (field in prevData) {
        return { ...prevData, [field]: value };
      } else if (field.startsWith("alloc.")) {
        const newAlloc = [...prevData.alloc];
        const allocField = field.split(".")[1] as keyof Allocation;
        newAlloc[index!][allocField] = value;
        return { ...prevData, alloc: newAlloc };
      } else if (field.startsWith("nodes.")) {
        const newNodes = [...prevData.nodes];
        const nodeField = field.split(".")[1] as keyof Node;
        (newNodes[index!] as any)[nodeField] = value;
        return { ...prevData, nodes: newNodes };
      }
      return prevData;
    });
  };
  const handleAddAlloc = () => {
    setNetworkData((prevData) => ({
      ...prevData,
      alloc: [...prevData.alloc, { address: "", balance: "" }],
    }));
  };

  const handleAddNode = () => {
    setNetworkData((prevData) => ({
      ...prevData,
      nodes: [
        ...prevData.nodes,
        { name: "", type: "", ip: "", port: undefined },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      await createNetwork(networkData);
      onBack();
    } catch (err) {
      setErrorAPI({ error: (err as Error).message, type: "CREATE_NETWORK" });
    }
  };
  const validateLoader = (type: string, text: string) => {
    if (typeLoader === type && loaderButton === "ON") {
      return <Loader />;
    }
    return text;
  };
  console.log(loaderButton);
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-sm ring-1 p-6 rounded-md mt-5 w-[725px]"
    >
      <div className="border-t-4 mt-3 py-5">
        <div className="w-[100%]">
          <div className="w-[100%] justify-center flexr flex-col">
            <label
              htmlFor="id"
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Network ID - Network Name
            </label>
            <div className="mt-2 w-[100%]">
              <input
                id="id"
                name="id"
                type="text"
                value={networkData.id}
                onChange={(e) => handleChange(e, "id")}
                required
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
              />
            </div>
          </div>
        </div>
        <div className="w-[100%] justify-center flex items-center gap-5">
          <div className="w-[100%] justify-center flexr flex-col">
            <label
              htmlFor="chainId"
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Chain ID
            </label>
            <div className="mt-2 w-[100%]">
              <input
                id="chainId"
                name="chainId"
                type="number"
                value={networkData.chainId}
                onChange={(e) => handleChange(e, "chainId")}
                required
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
              />
            </div>
          </div>

          <div className="w-[100%] justify-center flexr flex-col">
            <label
              htmlFor="subnet"
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Subnet
            </label>
            <div className="mt-2 w-[100%]">
              <input
                id="subnet"
                name="subnet"
                type="text"
                value={networkData.subnet}
                onChange={(e) => handleChange(e, "subnet")}
                required
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-4 border-b-4 py-5">
        {networkData.alloc.map((alloc, index) => (
          <div
            key={index}
            className="w-[100%] justify-center flex items-center gap-5 mt-3 py-5"
          >
            <div className="w-[100%] justify-center flexr flex-col">
              <label
                htmlFor={`allocAddress${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Address
              </label>
              <div className="mt-2 w-[100%]">
                <input
                  id={`allocAddress${index}`}
                  name={`allocAddress${index}`}
                  type="text"
                  value={alloc.address}
                  onChange={(e) => handleChange(e, `alloc.address`, index)}
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
                />
              </div>
            </div>
            <div className="w-[100%] justify-center flexr flex-col">
              <label
                htmlFor={`allocBalance${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Balance
              </label>
              <div className="mt-2 w-[100%]">
                <input
                  id={`allocBalance${index}`}
                  name={`allocBalance${index}`}
                  type="text"
                  value={alloc.balance}
                  onChange={(e) => handleChange(e, `alloc.balance`, index)}
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAlloc}
          className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] p-2 w-44"
        >
          Add Allocation
        </button>
      </div>
      <div className="border-t-4 mt-3 py-5 border-b-4">
        {networkData.nodes.map((node, index) => (
          <div
            key={index}
            className="w-[100%] justify-center flex items-center gap-5 mt-3"
          >
            <div className="w-[100%] justify-center flexr flex-col">
              <label
                htmlFor={`nodeName${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Node Name
              </label>
              <div className="mt-2 w-[100%]">
                <input
                  id={`nodeName${index}`}
                  name={`nodeName${index}`}
                  type="text"
                  value={node.name}
                  onChange={(e) => handleChange(e, `nodes.name`, index)}
                  required
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
                />
              </div>
              <label
                htmlFor={`nodeType${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Node Type
              </label>
              <div className="mt-2 w-[100%]">
                <select
                  id={`nodeType${index}`}
                  name={`nodeType${index}`}
                  value={node.type}
                  onChange={(e) => handleChange(e, `nodes.type`, index)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select Node Type</option>
                  <option value="MINER">MINER</option>
                  <option value="RPC">RPC</option>
                  <option value="NORMAL">NORMAL</option>
                </select>
              </div>
            </div>
            <div className="w-[100%] justify-center flexr flex-col">
              <label
                htmlFor={`nodeIp${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Node IP
              </label>
              <div className="mt-2 w-[100%]">
                <input
                  id={`nodeIp${index}`}
                  name={`nodeIp${index}`}
                  type="text"
                  value={node.ip}
                  onChange={(e) => handleChange(e, `nodes.ip`, index)}
                  required
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
                />
              </div>

              <label
                htmlFor={`nodePort${index}`}
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Node Port
              </label>
              <div className="mt-2 w-[100%]">
                <input
                  id={`nodePort${index}`}
                  name={`nodePort${index}`}
                  type="number"
                  value={node.port ?? ""}
                  onChange={(e) => handleChange(e, `nodes.port`, index)}
                  className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-[100%]"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddNode}
          className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] p-2 mt-4 w-44"
        >
          Add Node
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mt-4">
          {error}
        </div>
      )}
      {errorAPI?.error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mt-4">
          {errorAPI.error}
        </div>
      )}
      <div className="mt-4 w-[100%]">
        <button
          type="submit"
          className="bg-[#32e4f0] h-11 text-white mt-7 p-2 w-full text-center"
        >
          {validateLoader("CREATE", "SUBMIT")}
          {/* SUBMIT */}
        </button>
        <button
          type="button"
          className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 mt-7 p-2 w-full text-center"
          onClick={onBack}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default EditNetwork;
