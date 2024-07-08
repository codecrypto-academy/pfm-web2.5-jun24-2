import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { promisify } from 'util';
import { startContainer, stopContainer, listContainers, restartContainer } from './dockerService';
import { NetworkNode } from '../interfaces/networkNode';
import { Alloc } from '../interfaces/alloc';
import path from 'path';
import { Network } from '../interfaces/network';
import { CommandNodePair } from '../interfaces/commandNodePair';
import * as ip from 'ip';



const execAsync = promisify(exec);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createNetwork(req: Request, res: Response) {
  const network:Network = req.body;
  

  try {

    //validate if the network id exists
    await validateAndCreateNetwork(network);

    //validate nodes Ips
    validateNodeIPs(network);

    // Create accounts
    await createAccounts(network.chainId, network.nodes);

    const genesis = getGenesis(network.chainId, network.alloc, network.nodes);

    // Genesis filename
    const genesisPath = path.join(process.cwd(), 'data', `net${network.chainId}`);
    const filename = path.join(genesisPath, `genesis${network.chainId}.json`);
    await fs.writeFile(filename, JSON.stringify(genesis, null, 2));

    // Initialize network  
    await initializeEthereumNodes(network.nodes, network.chainId);

    await generateEnodes(network.nodes, network.chainId);
    
    await initializeNodes(network);

    // Start miners
    res.status(200).send('Network initialized successfully');
  } catch (error) {
    res.status(500).send(`Error initializing network: ${error}`);
  }
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

async function restartNetwork(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  try {
    const containers = await listContainers();

    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }

    const containersToRestart = getContainersByNetwork(containers, id);

    if (containersToRestart.length === 0) {
      return res.status(404).json({ error: 'No containers found in the specified network' });
    }

    const restartPromises = containersToRestart.map(container => restartContainer(container.Id));
    await Promise.all(restartPromises);

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

async function listNodes(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Network ID is required' });
  }

  const networksMap = await getGroupedNetworks();
  const network = networksMap[id];
  if (!network) {
    return res.status(404).json({ error: 'Network not found' });
  }
  
  const nodes = network.Nodes;
  res.status(200).json(nodes);
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

// account new
const createAccounts = async (chainId: number, nodes: NetworkNode[]): Promise<void> => {

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    //const nodeIndex = index + 1;
    const nodeName = getNodeName(node);
    const keystorePath = `${process.cwd()}\\data\\net${chainId}\\${nodeName}\\keystore`;
    const pwdPath = `${process.cwd()}\\data\\pwd.txt`;

    const dockerCommand = `docker run --rm -v "${keystorePath}:/data/net${chainId}/${nodeName}" -v "${pwdPath}:/data/pwd.txt" ethereum/client-go:v1.13.15 account new --password /data/pwd.txt --keystore /data/net${chainId}/${nodeName}`;

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

const getGenesis = (chainId: number, alloc: Alloc[], nodes: NetworkNode[]) => {
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

const generateExtradata = (nodes: NetworkNode[]) => {
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

const addMinerAllocations = (alloc: Alloc[], nodes: NetworkNode[]): Alloc[] => {
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

// init
async function initializeEthereumNodes(nodes: NetworkNode[], chainId: number): Promise<void> {
  const genesisFilePath = `${process.cwd()}\\data\\net${chainId}\\genesis${chainId}.json`;
  const dockerImage = 'ethereum/client-go:v1.13.15';

  const promises: Promise<void>[] = [];

  for (const node of nodes) {
    const nodeName = getNodeName(node);
    const dataDir = `${process.cwd()}\\data\\net${chainId}\\${nodeName}`;

    const command = `docker run --rm -v "${dataDir}:/data/net${chainId}/${node.name}" -v "${genesisFilePath}:/data/net${chainId}/genesis.json" ${dockerImage} init --datadir /data/net${chainId}/${node.name} /data/net${chainId}/genesis.json`;

    promises.push(
      executeCommand(command).then(() => {
        console.log(`Node ${node.name} initialized.`);
      }).catch((error) => {
        console.error(`Failed to initialize node ${node.name}: ${error}`);
      })
    );
  }
  await Promise.all(promises);
}

async function executeCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        resolve();
      } else {
        console.log(`stdout: ${stdout}`);
        resolve();
      }
    });
  });
}


function getNodeName(node:NetworkNode) {
  return `node-${node.type}_${node.name}`;
}
function getEnvPath(chainId:number) {
  return path.join(process.cwd(), 'data', `net${chainId}`);  
}

async function generateEnodes(nodes: NetworkNode[], chainId:number) {
  const promises: Promise<void>[] = [];
  for (const node of nodes) {
    const nodeName = getNodeName(node);
    const nodekeyPath = path.join(getEnvPath(chainId), nodeName, 'nodekey');
    const nodekeyCommand = `bootnode -genkey "${nodekeyPath}"`;
    
    const promise = execAsync(nodekeyCommand)
      .then(() => {
        console.log(`Node key generated for ${nodeName}`);
      })
      .catch((error) => {
        console.error(`Error generating node key for ${nodeName}:`, error);
      });
    promises.push(promise);
  }
  await Promise.all(promises);

  for (const node of nodes) {
    const nodeName = getNodeName(node);
    const nodekeyPath = path.join(getEnvPath(chainId), nodeName, 'nodekey');
    const enodeCommand = `bootnode -nodekey "${nodekeyPath}" -writeaddress`;

    const promise = execAsync(enodeCommand)
      .then((result) => {
        console.log("ENODE:", result)        
        node.enode = `enode://${result.stdout.replace(/\n$/, '')}@${nodeName}:30303`;
      })
      .catch((error) => {
        console.error(`Error generating node key for ${nodeName}:`, error);
      });
    promises.push(promise);
  }
  await Promise.all(promises);
}

async function initializeNodes(network: Network) {
  const promises: Promise<void>[] = [];
  const commandNodePairs = generateDockerCommands(network);
  console.log("COMMANDS: ", commandNodePairs);

  for (const { node, command } of commandNodePairs) {
    const promise = executeCommand(command)
      .then(() => {
        console.log(`Node key generated for ${node.name}`);
      })
      .catch((error) => {
        console.error(`Error generating node key for ${node.name}:`, error);
      });

    promises.push(promise);
  }
  await Promise.all(promises);
}

function generateDockerCommands(networkSettings: Network): CommandNodePair[] {
  const usedPorts = new Set<number>();
  const commands = networkSettings.nodes.map(node => {
      const nodeName = getNodeName(node);
      const baseCommand = `docker run -d --name ${nodeName} --network ${networkSettings.id} --label ${networkSettings.id} --ip ${node.ip}`;
      const volumeMappings = `-v "${process.cwd()}/data/net${networkSettings.chainId}/${nodeName}:/root/.ethereum" -v "${process.cwd()}/data/pwd.txt:/root/.ethereum/password.txt"`;
      const ports = node.port ? `-p ${node.port}:8545` : '';
      const alwaysPort = node.port && !usedPorts.has(30303) ? `-p 30303:30303` : '';
      if (node.port) {
          usedPorts.add(node.port);
      }
      const baseGethCommand = `ethereum/client-go:v1.13.15 --networkid ${networkSettings.chainId}`;
      const minerConfig = node.type === 'miner' ? `--mine --miner.etherbase="${node.address}"` : '';
      const httpConfig = `--http --http.addr "0.0.0.0" --http.port 8545 --http.api "admin,eth,debug,miner,net,txpool,personal,web3" --http.corsdomain "*"`;
      const syncMode = `--syncmode "full"`;
      const unlockAccount = `--unlock "${node.address}" --password "/root/.ethereum/password.txt" --allow-insecure-unlock`;
      const bootnode = `--bootnodes "${node.enode}"`;

      const command = `${baseCommand} ${volumeMappings} ${ports} ${alwaysPort} ${baseGethCommand} ${minerConfig} ${httpConfig} ${syncMode} --port 30303 ${unlockAccount} ${bootnode}`;
      return { node, command };
  });

  return commands;
}

async function validateAndCreateNetwork(networkSettings: Network): Promise<void> {
  const networkName = networkSettings.id;
  const subnet = networkSettings.subnet;

  try {
    const existingNetworks = await new Promise<string>((resolve, reject) => {
      exec(`docker network ls --filter name=^${networkName}$ --format "{{ .Name }}"`, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          resolve('');
        } else {
          resolve(stdout.toString().trim());
        }
      });
    });

    if (existingNetworks) {
      throw new Error(`Network ${networkName} already exists.`);
    }

    await executeCommand(`docker network create --subnet=${subnet} ${networkName}`);
    console.log(`Network ${networkName} created successfully.`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function validateNodeIPs(network: Network): void {
  const subnetInfo = ip.subnet(network.subnet.split('/')[0], network.subnet.split('/')[1]);
  const broadcastAddress = subnetInfo.broadcastAddress;
  const gatewayAddress = ip.cidrSubnet(network.subnet).firstAddress; // La dirección de gateway es la primera dirección en la subred

  for (const node of network.nodes) {
    if (node.ip === broadcastAddress || node.ip === gatewayAddress) {
      throw new Error(`IP address ${node.ip} for node ${node.name} is either a broadcast address or a gateway address.`);
    }
  }
  
  console.log('All node IP addresses are valid.');
}

export {
  createNetwork,
  stopNetwork,
  restartNetwork,
  startNetwork,
  listNetworks,
  listNodes
};
