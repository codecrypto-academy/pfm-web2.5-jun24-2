import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { promisify } from 'util';
import { startContainer, stopContainer, listContainers } from './dockerService';

const execAsync = promisify(exec);

interface Node {
  name: string;
  type: string;
  ip: string;
  port?: number;
  address: string
}

interface Alloc {
  address: string,
  balance: string ;
}

async function createNetwork(req: Request, res: Response) {
  const { id, chainId, subnet, ipBootnode, alloc, nodes }: { id: string, chainId: string, subnet: string, ipBootnode: string, alloc: Alloc[], nodes: Node[] } = req.body;
  
  // Create accounts
  await createAccounts(chainId, nodes);

  const genesis = getGenesis(chainId, alloc, nodes);

  // Genesis filename
  const genesisPath = `${process.cwd()}\\data\\${chainId}`
  const filename = `${genesisPath}\\genesis${chainId}.json`;
  await fs.writeFile(filename, JSON.stringify(genesis, null, 2));

  // Initialize network

  // Initialize node

  // Start miners

  //res.status(200).send(`Genesis file created: ${filename}`);
  res.status(200).send(`Genesis file created`);
}

async function stopNetwork(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  try {
    const containers = await listContainers();

    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }

    const containersToStop = getContainersByNetwork(containers, id);

    if (containersToStop.length === 0) {
      return res.status(404).json({ error: 'No containers found in the specified network' });
    }

    const stopPromises = containersToStop.map(container => stopContainer(container.Id));
    await Promise.all(stopPromises);

    res.status(200).json({ message: 'Network stopped', network: id });
  } catch (error:any) {
    console.error('Error stopping network:', error);
    res.status(500).json({ error: 'Failed to stop network', details: error.message });
  }
}

async function startNetwork(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  try {
    const containers = await listContainers();

    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }

    const containersToStart = getContainersByNetwork(containers, id);

    if (containersToStart.length === 0) {
      return res.status(404).json({ error: 'No containers found in the specified network' });
    }

    const startPromises = containersToStart.map(container => startContainer(container.Id));
    await Promise.all(startPromises);

    res.status(200).json({ message: 'Network started', network: id });
  } catch (error:any) {
    console.error('Error starting network:', error);
    res.status(500).json({ error: 'Failed to start network', details: error.message });
  }
}

async function listNetworks(req: Request, res: Response) {
  const networksMap = await getGroupedNetworks();
  res.status(200).json(networksMap);
}

async function getGroupedNetworks() {
  const containers = await listContainers();
  const networksMap: { [networkId: string]: any } = {};

  containers.forEach(container => {
    const networkName = Object.keys(container.NetworkSettings.Networks)[0];
    const networkSettings = container.NetworkSettings.Networks[networkName];
    const networkId = networkSettings.NetworkID;
    const gateway = networkSettings.Gateway;
    const ipAddress = networkSettings.IPAddress;

    // Validación de gateway y networkId
    if (gateway && networkId) {
      if (!networksMap[networkId]) {
        networksMap[networkId] = {
          NetworkName: networkName,
          NetworkID: networkId,
          Gateway: gateway,
          IPAddress: ipAddress,
          Nodes: []
        };
      }

      networksMap[networkId].Nodes.push({
        Name: container.Names[0],
        Status: container.Status,
        State: container.State,
        IPAddress: ipAddress
      });
    }
  });

  return networksMap;
}



const createAccounts = async (chainId: string, nodes: Node[]): Promise<void> => {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const nodeIndex = index + 1;
    const nodeName = `node-${node.type}-${nodeIndex}`;
    const keystorePath = `${process.cwd()}\\data\\${chainId}\\${nodeName}\\keystore`;
    const pwdPath = `${process.cwd()}\\data\\pwd.txt`;

    // Docker command to create the account
    const dockerCommand = `docker run --rm -v "${keystorePath}:/data/${chainId}/${nodeName}" -v "${pwdPath}:/data/pwd.txt" ethereum/client-go:v1.13.15 account new --password /data/pwd.txt --keystore /data/${chainId}/${nodeName}`;
    
    try {
      const { stdout } = await execAsync(dockerCommand);
      const addressMatch = stdout.match(/0x[a-fA-F0-9]{40}/);
      if (addressMatch) {        
        node.address = addressMatch[0].startsWith('0x') ? addressMatch[0].substring(2) : addressMatch[0];
        console.log(`Account created for ${nodeName}: ${node.address}`);
      } else {
        console.error(`Address not found in output for ${nodeName}`);
      }
    } catch (error) {
      console.error(`Error creating account for ${nodeName}: ${error}`);
    }
  }
};

const getGenesis = (chainId: string, alloc: Alloc[], nodes: Node[]) => {
  const extradata = generateExtradata(nodes);
  
  //Remove 0x if the alloc.address has it
  alloc = alloc.map(a => ({ ...a, address: a.address.startsWith('0x') ? a.address.substring(2) : a.address }));
  const allocations = addMinerAllocations(alloc, nodes)
  
  const mappedAllocations = allocations.reduce((acc, alloc) => {
    acc[alloc.address] = { balance: alloc.balance };
    return acc;
  }, {} as { [address: string]: { balance: string } });

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
    alloc: mappedAllocations
  };
};

const generateExtradata = (nodes: Node[]) => {
  // Filter validator nodes (type 'miner')
  const miners = nodes.filter(node => node.type === 'miner').map(node => node.address);

  // Generate the `extradata` field required by the Clique protocol for validators.
  // prefix 64 '0'
  const prefix = "0000000000000000000000000000000000000000000000000000000000000000";

  // suffix 130 '0'
  const suffix = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  const minerAddresses = miners.join('');
  const extradata = '0x' + prefix + minerAddresses + suffix;
  return extradata;
};

const getContainersByNetwork = (containers: any[], networkId: string) => {
  return containers.filter(container => {
    const networkName = Object.keys(container.NetworkSettings.Networks)[0];
    const networkSettings = container.NetworkSettings.Networks[networkName];
    return networkSettings.NetworkID === networkId;
  });
};

const addMinerAllocations = (alloc: Alloc[], nodes: Node[]): Alloc[] => {
  const miners = nodes.filter(node => node.type === 'miner')

  for (let index = 0; index < miners.length; index++) {
    const miner = miners[index];
    const item:Alloc = {
      address: miner.address,
      balance: '100000000000000000000'
    }
    alloc.push(item)
  }
  return alloc;
};


export {
  createNetwork,
  stopNetwork,
  // resetNetwork,
  startNetwork,
  listNetworks
};
