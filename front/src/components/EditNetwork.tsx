import React, { useState } from "react";

const EditNetwork = ({ onBack }) => {
  const [allocations, setAllocations] = useState(["adress", "0x adress"]);
  const [nodes, setNodes] = useState([
    { type: "MINER", name: "", ip: "", port: "" },
    { type: "RPC", name: "", ip: "", port: "" },
    { type: "NORMAL", name: "", ip: "", port: "" },
  ]);

  const addAllocation = () => setAllocations([...allocations, ""]);
  const removeAllocation = (index) =>
    setAllocations(allocations.filter((_, i) => i !== index));

  const addNode = () =>
    setNodes([...nodes, { type: "", name: "", ip: "", port: "" }]);
  const removeNode = (index) => setNodes(nodes.filter((_, i) => i !== index));

  const [formData, setFormData] = useState({
    networkID: "",
    chainID: "",
    subnet: "",
    ipBootnode: "",
    allocations: "",
  });
// Fiunción para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
//Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="my-4 text-white mr-10">Edit Network</h1>
        <p>
          <button
            type="button"
            onClick={onBack}
            className="bg-[#155163] w-36 h-8 hover:bg[#32e4f0] text-white rounded-lg text-sm"
          >
            Return to Networks
          </button>
        </p>
      </div>
      <form className="container" onSubmit={handleSubmit}>
      <div className="mb-3 text-white">
        <label className="px-2 py-0.5">Network ID</label>
        <input
          name="networkID"
          type="text"
          
          value={formData.networkID}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 text-white">
        <label className="px-2 py-0.5">Chain ID</label>
        <input
          name="cahinId"
          type="text"
          className="form-control"
          value={formData.chainID}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 text-white">
        <label className="px-2 py-0.5">Subnet</label>
        <input
          name="subnet"
          type="text"
          className="form-control"
          value={formData.subnet}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 text-white">
        <label className="px-2 py-0.5">IP Bootnode</label>
        <input
          name="ipBootnode"
          type="text"
          className="form-control"
          value={formData.ipBootnode}
          onChange={handleChange}
        />
      </div>
      <h3 className="text-white">Allocation</h3>
      {allocations.map((allocation, index) => (
        <div key={index} className="input-group mb-3">
          <button
            type="button"
            className="bg-red-500 text-white text-xs font-bold py-0.5 px-0.5 rounded border border-red-700 hover:bg-red-600 mr-2"
            onClick={() => removeAllocation(index)}
          >
            X
          </button>
          <input
            //name="allocations"
            type="text"
            className="form-control"
            value={allocation}
            onChange={(e) => {
              const newAllocations = [...allocations];
              newAllocations[index] = e.target.value;
              setAllocations(newAllocations);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary mb-4 text-white"
        onClick={addAllocation}
      >
        Add Allocation
      </button>
      <h3 className="text-white">Nodes</h3>
      {nodes.map((node, index) => (
        <div key={index} className="d-flex mb-3">
          <button
            type="button"
            className="bg-red-500 text-white text-xs font-bold py-0.5 px-0.5 rounded border border-red-700 hover:bg-red-600 mr-2"
            onClick={() => removeNode(index)}
          >
            X
          </button>
          <select
            className="form-select me-2"
            value={node.type}
            onChange={(e) => {
              const newNodes = [...nodes];
              newNodes[index].type = e.target.value;
              setNodes(newNodes);
            }}
          >
            <option value="MINER">MINER</option>
            <option value="RPC">RPC</option>
            <option value="NORMAL">NORMAL</option>
          </select>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Name"
            value={node.name}
            onChange={(e) => {
              const newNodes = [...nodes];
              newNodes[index].name = e.target.value;
              setNodes(newNodes);
            }}
          />
          <input
            type="text"
            className="form-control me-2"
            placeholder="IP"
            value={node.ip}
            onChange={(e) => {
              const newNodes = [...nodes];
              newNodes[index].ip = e.target.value;
              setNodes(newNodes);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Port"
            value={node.port}
            onChange={(e) => {
              const newNodes = [...nodes];
              newNodes[index].port = e.target.value;
              setNodes(newNodes);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary text-white"
        onClick={addNode}
      >
        Add Node
      </button>
      <p />
      <div className="flex justify-center items-center py-4">
        <button
          type="submit"
          className="bg-[#155163] w-36 h-8 hover:bg-[#32e4f0] hover:text-black text-white rounded-lg"
        >
          Enviar
        </button>
      </div>
    </form>
    </>
  );
};

export default EditNetwork;
