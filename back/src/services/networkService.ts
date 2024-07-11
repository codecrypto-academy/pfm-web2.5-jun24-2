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
import { createAccount, generateDockerCommandForNode, generateEnode, generateNodekey, getNodeName, initNetworkForNode, initNode } from './nodeService';
import { executeCommand } from '../common/ultils';

async function createNetwork(req: Request, res: Response) {
  var nuevoId:number = 0;
  if (typeof req.body.chainId === 'string') {
    nuevoId = Number(req.body.chainId);
  }

  console.log("ANTES:" , req.body.chainId)  
  const network:Network = req.body;
  network.chainId = nuevoId;
  console.log("DESPUES:" , network.chainId)  
  console.log("NETWORK: ", network)
  try {
    //validate if the network id exists
    await validateAndCreateNetwork(network);

    await validateMinimumQtyOfNodes(network);

    //validate nodes Ips
    validateNodesIP(network);

    // Create accounts
    await createAccounts(network.chainId, network.nodes);

    const genesis = getGenesis(network.chainId, network.alloc, network.nodes);

    // Genesis filename
    const genesisPath = path.join(process.cwd(), 'data', `net${network.chainId}`);
    const filename = path.join(genesisPath, `genesis${network.chainId}.json`);
    await fs.writeFile(filename, JSON.stringify(genesis, null, 2));

    // Initialize network  
    await initializeEthereumNodes(network.nodes, network.chainId);

    await getEnodes(network.nodes, network.chainId);
    
    ////////////------------------------------------
    console.log("ACAAAA")
    const nodesTest = configureNodes(network.nodes);
    console.log("NODES TEST: ", nodesTest)

    await initializeNetworkNodes(network);

    res.status(200).send('Network initialized successfully');
  } catch (error) {
    res.status(500).send(`Error initializing network: ${error}`);
  }
}

//-----------------
function configureNodes(nodes: NetworkNode[]): NetworkNode[] {
  if (nodes.length < 2) {
    throw new Error('La lista de nodos debe contener al menos dos nodos.');
  }

  // Filtrar los nodos mineros y no mineros
  const minerNodes = nodes.filter(node => node.type.toLowerCase() === 'miner');
  const nonMinerNodes = nodes.filter(node => node.type.toLowerCase() !== 'miner');

  // if (minerNodes.length < 2) {
  //   throw new Error('Debe haber al menos dos nodos mineros.');
  // }

  // Configurar enodes para los nodos mineros
  for (let i = 0; i < minerNodes.length; i++) {
    const currentNode = minerNodes[i];
    const nextNode = minerNodes[(i + 1) % minerNodes.length]; // Circular reference to next miner node
    currentNode.bootnodes = [nextNode.enode];
  }

  // Configurar bootnodes para nodos no mineros
  const minerEnodes = minerNodes.map(node => node.enode);
  for (const node of nonMinerNodes) {
    node.bootnodes = minerEnodes;
  }

  return nodes;
}
//-----------------

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
  // console.log("CONTAINERS", containers)
  const networksMap: { [networkId: string]: any } = {};

  containers.forEach(container => {
    if (container.Image !== "ethereum/client-go:v1.13.15") {
      return; // Filtrar contenedores que no usan la imagen especificada
    }

    const networkName = Object.keys(container.NetworkSettings.Networks)[0];
    const networkSettings = container.NetworkSettings.Networks[networkName];
    const networkId = networkSettings.NetworkID;
    const gateway = networkSettings.Gateway;
    const ipAddress = networkSettings.IPAddress;

    // Validación de gateway y networkId
    if (!networksMap[networkId]) {
      networksMap[networkId] = {
        NetworkName: networkName,
        NetworkID: networkId,
        Gateway: gateway,
        IPAddress: ipAddress,
        Nodes: []
      };
    }

    // Asegurarse de agregar cada nodo correctamente
    networksMap[networkId].Nodes.push({
      Id: container.Id,
      Name: container.Names[0],
      Status: container.Status,
      State: container.State,
      IPAddress: ipAddress
    });
  });

  // Determinar el estado de cada red
  Object.values(networksMap).forEach(network => {
    const nodes = network.Nodes;
    const allRunning = nodes.every((node: { State: string; }) => node.State === "running");
    const anyRunning = nodes.some((node: { State: string; }) => node.State === "running");

    if (allRunning) {
      network.State = "Running";
    } else if (anyRunning) {
      network.State = "Partially Running";
    } else {
      network.State = "Stopped";
    }
  });

  return networksMap;
}

// account new
const createAccounts = async (chainId: number, nodes: NetworkNode[]): Promise<void> => {

  for (let index = 0; index < nodes.length; index++) {
    await createAccount(nodes, index, chainId);
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
  const genesisFilePath = path.join(process.cwd(), 'data', `net${chainId}`, `genesis${chainId}.json`);
  const dockerImage = 'ethereum/client-go:v1.13.15';

  const promises: Promise<void>[] = [];

  for (const node of nodes) {
    initNetworkForNode(node, chainId, genesisFilePath, dockerImage, promises);
  }
  await Promise.all(promises);
}

async function getEnodes(nodes: NetworkNode[], chainId:number) {
  const promises: Promise<void>[] = [];
  for (const node of nodes) {
    const promise = generateNodekey(node, chainId);
    promises.push(promise);
  }
  await Promise.all(promises);

  for (const node of nodes) {
    const promise = generateEnode(node, chainId);
    promises.push(promise);
  }
  await Promise.all(promises);
}

async function initializeNetworkNodes(network: Network) {
  const promises: Promise<void>[] = [];
  const commandNodePairs = generateDockerCommands(network);
  //console.log("COMMANDS: ", commandNodePairs);

  for (const { node, command } of commandNodePairs) {
    const promise = initNode(command, node);
    promises.push(promise);
  }
  await Promise.all(promises);
}

function generateDockerCommands(network: Network): CommandNodePair[] {
  const bootnode = network.nodes.find(node => node.port != null);

  if (!bootnode) {
    throw new Error("No se encontró un nodo con 'node.port' definido.");
  }

  const bootnodeEnode = bootnode.enode;

  // Generar comandos para todos los nodos usando el enode del nodo identificado
  return network.nodes.map(node => generateDockerCommandForNode(node, network.id, network.chainId, bootnodeEnode));
}

async function addNewNodes(req: Request, res: Response) {
  try{
    const network:Network = req.body;

    // validar que la red exista
    await validateNetworkExists(network);
    
    // validar que la ip sea valida
    validateNodesIP(network);
    
    // validar que los nodos no existan: nombre    
    await validateNodesInNetwork(network);

    // validar que los puertos sean validos
    console.log("validateNodePorts")
    await validateNodePorts(network);

    // crear cuenta
    console.log("createAccounts")
    await createAccounts(network.chainId, network.nodes);

    const genesisPath = path.join(process.cwd(), 'data', `net${network.chainId}`);

    // Initialize network  
    await initializeEthereumNodes(network.nodes, network.chainId);

    await getEnodes(network.nodes, network.chainId);
    
    await initializeNetworkNodes(network);

    res.status(200).send('Network initialized successfully');
  }  
  catch (error) {
    res.status(500).send(`Error initializing network: ${error}`);
  }
}

async function validateNodePorts(network: Network): Promise<void> {
  const containers = await listContainers();
  const usedPorts = new Set<number>();

  containers.forEach(container => {
    container.Ports.forEach((portMapping: any) => {
      if (portMapping.PublicPort) {
        usedPorts.add(portMapping.PublicPort);
      }
    });
  });

  for (const node of network.nodes) {
    if (node.port && usedPorts.has(node.port)) {
      throw new Error(`Port ${node.port} for node ${node.name} is already in use.`);
    }
  }

  console.log('All node ports are valid and not in use.');
}

async function validateNodesInNetwork(network: Network): Promise<void> {
  const networksMap = await getGroupedNetworks();
  const networkName = network.id;
  
  let networkInfo = null;
  for (const networkId in networksMap) {
    if (networksMap[networkId].NetworkName === networkName) {
      networkInfo = networksMap[networkId];
      break;
    }
  }

  if (!networkInfo) {
    throw new Error(`Network with name ${networkName} does not exist.`);
  }

  const existingNodes = networkInfo.Nodes.map((node: any) => node.Name);

  for (const node of network.nodes) {
    if (existingNodes.includes(node.name)) {
      throw new Error(`Node with name ${node.name} already exists in network ${networkName}.`);
    }
  }

  console.log(`All nodes are valid and do not already exist in the network ${networkName}.`);
}

async function validateNetworkExists(network: Network): Promise<void> {
  const networkName = network.id;

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

    if (!existingNetworks) {
      throw new Error(`Network ${networkName} does not exist.`);
    }

    console.log(`Network ${networkName} exists.`);
  } catch (error) {
    console.error(error);
    throw error;
  }
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

function validateMinimumQtyOfNodes(network: Network) {
  try {
    
    const normalizedNodes = network.nodes.map(node => ({
      ...node,
      type: node.type.toLowerCase()
    }));

    // Verifica que hay al menos 2 nodos y que al menos uno es de tipo 'miner'
    if (normalizedNodes.length < 2 || !normalizedNodes.some(node => node.type === 'miner')) {
      throw new Error('You need at least 2 nodes and at least one node of type "MINER".');
    }

    console.log(`Minimum quantity of nodes validated.`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function validateNodesIP(network: Network): void {
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
  listNodes,
  addNewNodes
};


