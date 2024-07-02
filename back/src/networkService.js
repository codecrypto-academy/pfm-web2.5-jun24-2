const { createContainer, startContainer, stopContainer, removeContainer, listContainers } = require('./dockerService');

let networks = {};

async function createNetwork(req, res) {
  const { id, chainId, subnet, ipBootnode, alloc, nodos } = req.body;
  
  // Aquí iría la lógica para crear el archivo genesis.json y demás configuración específica de Ethereum PoA.
  
  // Crear contenedores Docker para cada nodo
  for (const nodo of nodos) {
    const containerOptions = {
      Image: 'ethereum/client-go:stable',
      Cmd: [/* Comandos específicos para cada nodo */],
      name: `${id}-${nodo.name}`,
      // Configuración de red y puertos
    };
    const container = await createContainer(containerOptions);
    await startContainer(container);
    networks[id] = networks[id] || [];
    networks[id].push(container);
  }
  
  res.status(201).json({ message: 'Network created', network: id });
}

async function stopNetwork(req, res) {
  const { id } = req.params;
  if (!networks[id]) {
    return res.status(404).json({ message: 'Network not found' });
  }

  for (const container of networks[id]) {
    await stopContainer(container);
  }

  res.status(200).json({ message: 'Network stopped', network: id });
}

async function resetNetwork(req, res) {
  const { id } = req.params;
  if (!networks[id]) {
    return res.status(404).json({ message: 'Network not found' });
  }

  for (const container of networks[id]) {
    await stopContainer(container);
    await removeContainer(container);
  }

  delete networks[id];
  await createNetwork(req, res); // Re-crear la red
}

async function startNetwork(req, res) {
  const { id } = req.params;
  if (!networks[id]) {
    return res.status(404).json({ message: 'Network not found' });
  }

  for (const container of networks[id]) {
    await startContainer(container);
  }

  res.status(200).json({ message: 'Network started', network: id });
}

async function listNetworks(req, res) {
  const containers = await listContainers();
  const networksMap = {};

  containers.forEach(container => {
    const networkName = Object.keys(container.NetworkSettings.Networks)[0];

    if (!networksMap[networkName]) {
      networksMap[networkName] = [];
    }

    networksMap[networkName].push({
      Name: container.Names[0],
      Status: container.Status,
      State: container.State
    });
  });

  const value =  Object.keys(networksMap).map(network => ({
    Network: network,
    Nodos: networksMap[network]
  }));
  res.status(200).json(value);
}

module.exports = {
  createNetwork,
  stopNetwork,
  resetNetwork,
  startNetwork,
  listNetworks,
};
