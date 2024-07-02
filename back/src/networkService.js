const { createContainer, startContainer, stopContainer, removeContainer, listContainers } = require('./dockerService');

async function createNetwork(req, res) {
  const { id, chainId, subnet, ipBootnode, alloc, nodos } = req.body;
  
  let networks = {}; //cambiar

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

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  try {
    const containers = await listContainers();

    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }

    const containersToStop = containers.filter(container => {
      const networkName = Object.keys(container.NetworkSettings.Networks)[0];
      const networkSettings = container.NetworkSettings.Networks[networkName];
      return networkSettings.NetworkID === id;
    });

    if (containersToStop.length === 0) {
      return res.status(404).json({ error: 'No containers found in the specified network' });
    }

    const stopPromises = containersToStop.map(container => stopContainer(container.Id));
    await Promise.all(stopPromises);

    res.status(200).json({ message: 'Network stopped', network: id });
  } catch (error) {
    console.error('Error starting network:', error);
    res.status(500).json({ error: 'Failed to stop network', details: error.message });
  }
}

// async function resetNetwork(req, res) {
//   const { id } = req.params;
//   if (!networks[id]) {
//     return res.status(404).json({ message: 'Network not found' });
//   }

//   for (const container of networks[id]) {
//     await stopContainer(container);
//     await removeContainer(container);
//   }

//   delete networks[id];
//   await createNetwork(req, res); // Re-crear la red
// }

async function startNetwork(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  try {
    const containers = await listContainers();

    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }

    const containersToStart = containers.filter(container => {
      const networkName = Object.keys(container.NetworkSettings.Networks)[0];
      const networkSettings = container.NetworkSettings.Networks[networkName];
      return networkSettings.NetworkID === id;
    });

    if (containersToStart.length === 0) {
      return res.status(404).json({ error: 'No containers found in the specified network' });
    }

    const startPromises = containersToStart.map(container => startContainer(container.Id));
    await Promise.all(startPromises);

    res.status(200).json({ message: 'Network started', network: id });
  } catch (error) {
    console.error('Error starting network:', error);
    res.status(500).json({ error: 'Failed to start network', details: error.message });
  }
}


async function listNetworks(req, res) {
  const networksMap = await getGroupedNetworks();
  res.status(200).json(networksMap);
}

async function getGroupedNetworks()
{
  const containers = await listContainers();
  const networksMap = {};

  containers.forEach(container => {
    const networkName = Object.keys(container.NetworkSettings.Networks)[0];
    const networkSettings = container.NetworkSettings.Networks[networkName];
    const networkId = networkSettings.NetworkID;
    const gateway = networkSettings.Gateway;
    const ipAddress = networkSettings.IPAddress;

    if (!networksMap[networkId]) {
      networksMap[networkId] = {
        NetworkName: networkName,
        NetworkID: networkId,
        Gateway: gateway,
        IPAddress: ipAddress,
        Nodos: []
      };
    }

    networksMap[networkId].Nodos.push({
      Name: container.Names[0],
      Status: container.Status,
      State: container.State,
      IPAddress: ipAddress
    });
  });  

  return networksMap;
}

module.exports = {
  createNetwork,
  stopNetwork,
  //resetNetwork,
  startNetwork,
  listNetworks,  
};
