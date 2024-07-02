const { createContainer, startContainer, stopContainer, removeContainer, listContainers } = require('./dockerService');

async function createNetwork(req, res) {
  const { id, chainId, subnet, ipBootnode, alloc, nodos } = req.body;

  //crear las cuentas
  const accounts = createAccounts(chainId, nodos);

  const genesis = getGenesis(chainId, alloc, nodos);

  // Genesis filename
  const filename = `genesis${chainId}.json`;
  await fs.writeFile(filename, JSON.stringify(genesis, null, 2));

  // init network

  //init node

  //start miners

  res.status(200).send(`Genesis file created: ${filename}`);
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

const createAccounts = (chainId, nodos) => {
  nodos.forEach((nodo, index) => {
    const nodeIndex = index + 1;
    const nodeName = `node-${nodo.tipo}-${nodeIndex}`;
    const keystorePath = `${process.cwd()}/data/${chainId}/${nodeName}/keystore`;

    // Comando de Docker para crear la cuenta
    const dockerCommand = `docker run --rm -it -v ${keystorePath}:/data/${chainId}/${nodeName} ethereum/client-go:v1.13.15 account new --keystore /data/${chainId}/${nodeName}`;

    // Ejecutar el comando de Docker
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating account for ${nodeName}: ${error}`);
        return;
      }
      console.log(`Account created for ${nodeName}: ${stdout}`);
    });
  });
};


const getGenesis = (chainId, alloc, nodos) => {
  const extradata = generateExtradata(nodos);

  return {
    config: {
      chainId: chainId,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      clique: {
        period: 5,
        epoch: 30000
      }
    },
    difficulty: "1",
    gasLimit: "8000000",
    extradata: extradata,
    alloc: alloc
  };
};

const generateExtradata = (nodos) => {
  // Filtrar los nodos validadores (tipo 'miner')
  const miners = nodos.filter(nodo => nodo.tipo === 'miner').map(nodo => nodo.nombre);
  
  // Generar el campo `extradata` que es requerido por el protocolo Clique para los validadores.
  // prefix 64 '0'
  const prefix = "0000000000000000000000000000000000000000000000000000000000000000";

  //sufix 130 '0'
  const sufix = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  const minerAddresses = miners.join('');
  const extradata = '0x' + prefix + minerAddresses + sufix;
  return extradata;
};

module.exports = {
  createNetwork,
  stopNetwork,
  //resetNetwork,
  startNetwork,
  listNetworks,  
};
