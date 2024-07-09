import React, { useState } from 'react';


const EditNetwork = () => {
  const [allocations, setAllocations] = useState([
    'adress',
    '0x adress'
  ]);
  const [nodes, setNodes] = useState([
    { type: 'MINER', name: '', ip: '', port: '' },
    { type: 'RPC', name: '', ip: '', port: '' },
    { type: 'NORMAL', name: '', ip: '', port: '' }
  ]);

  const addAllocation = () => setAllocations([...allocations, '']);
  const removeAllocation = (index) => setAllocations(allocations.filter((_, i) => i !== index));

  const addNode = () => setNodes([...nodes, { type: 'NORMAL', name: '', ip: '', port: '' }]);
  const removeNode = (index) => setNodes(nodes.filter((_, i) => i !== index));

  return (
    <div className="container">
      <h1 className="my-4">Edit Network</h1>

      <div className="mb-3">
        <label className="px-2 py-0.5">Network ID</label>
        <input type="text" className="form-control" defaultValue="" />
      </div>

      <div className="mb-3">
        <label className="px-2 py-0.5">Chain ID</label>
        <input type="text" className="form-control" defaultValue="" />
      </div>

      <div className="mb-3">
        <label className="px-2 py-0.5">Subnet</label>
        <input type="text" className="form-control" defaultValue="" />
      </div>

      <div className="mb-3">
        <label className="px-2 py-0.5">IP Bootnode</label>
        <input type="text" className="form-control" defaultValue="" />
      </div>

      <h3>Allocation</h3>
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
        className="btn btn-secondary mb-4"
        onClick={addAllocation}
        type="button"
      >
        Add Allocation
      </button>

      <h3>Nodes</h3>
      {nodes.map((node, index) => (
        <div key={index} className="d-flex mb-3">
          <button
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
      <button className="btn btn-secondary" onClick={addNode} type="button">
        Add Node
      </button>
      <p />
      <div className="flex justify-center items-center py-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default EditNetwork;
