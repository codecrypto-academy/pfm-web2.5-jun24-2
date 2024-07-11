import { Request, Response } from 'express';
import { getContainer, listContainers, removeContainer, restartContainer, startContainer, stopContainer } from "./dockerService";
import { Network } from '../interfaces/network';
import { NetworkNode } from '../interfaces/networkNode';
import { CommandNodePair } from '../interfaces/commandNodePair';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { executeCommand } from '../common/ultils';


const execAsync = promisify(exec);

async function stopNode(req: Request, res: Response) {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'Node ID is required' });
    }
  
    try {
      const container = await getContainer(id);
  
      if (!container) {
        return res.status(404).json({ error: 'Node not found' });
      }
  
      await stopContainer(container.Id);  
      res.status(200).json({ message: 'Node stopped', Node: id });
    } catch (error:any) {
      console.error('Error stopping Node:', error);
      res.status(500).json({ error: 'Failed to stop Node', details: error.message });
    }
}
  
async function startNode(req: Request, res: Response) {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'Node ID is required' });
    }
  
    try {
      const container = await getContainer(id);
  
      if (!container) {
        return res.status(404).json({ error: 'Node not found' });
      }
  
      await startContainer(container.Id);  
      res.status(200).json({ message: 'Node started', Node: id });
    } catch (error:any) {
      console.error('Error starting Node:', error);
      res.status(500).json({ error: 'Failed to start Node', details: error.message });
    }
}

async function restartNode(req: Request, res: Response) {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'Node ID is required' });
    }
  
    try {
      const container = await getContainer(id);
  
      if (!container) {
        return res.status(404).json({ error: 'Node not found' });
      }
  
      await restartContainer(container.Id);  
      res.status(200).json({ message: 'Node restarted', Node: id });
    } catch (error:any) {
      console.error('Error restarting Node:', error);
      res.status(500).json({ error: 'Failed to restart Node', details: error.message });
    }
}

async function createAccount(nodes: NetworkNode[], index: number, chainId: number) {
  const node = nodes[index];
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

function generateDockerCommandForNode(node: NetworkNode, networkId: string, chainId: number, bootnodeEnode: string): CommandNodePair {
  const nodeName = getNodeName(node);
  const baseCommand = `docker run -d --name ${nodeName} --network ${networkId} --label ${networkId} --ip ${node.ip}`;
  const volumeMappings = `-v "${process.cwd()}/data/net${chainId}/${nodeName}:/root/.ethereum" -v "${process.cwd()}/data/pwd.txt:/root/.ethereum/password.txt"`;
  const ports = node.port ? `-p ${node.port}:8545` : '';
  const baseGethCommand = `ethereum/client-go:v1.13.15 --networkid ${chainId}`;
  const minerConfig = node.type === 'miner' ? `--mine --miner.etherbase="${node.address}"` : '';
  const httpConfig = `--http --http.addr "0.0.0.0" --http.port 8545 --http.api "admin,eth,debug,miner,net,txpool,personal,web3" --http.corsdomain "*"`;
  const syncMode = `--syncmode "full"`;
  const unlockAccount = `--unlock "${node.address}" --password "/root/.ethereum/password.txt" --allow-insecure-unlock`;
  const bootnode = `--bootnodes "${node.bootnodes}"`;

  const command = `${baseCommand} ${volumeMappings} ${ports} ${baseGethCommand} ${minerConfig} ${httpConfig} ${syncMode} --port 30303 ${unlockAccount} ${bootnode}`;
  return { node, command };
}

function getNodeName(node:NetworkNode) {
  return `node-${node.type}_${node.name}`;
}

function getEnvPath(chainId:number) {
  return path.join(process.cwd(), 'data', `net${chainId}`);  
}

function generateNodekey(node: NetworkNode, chainId: number) {
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
  return promise;
}

function generateEnode(node: NetworkNode, chainId: number) {
  const nodeName = getNodeName(node);
  const nodekeyPath = path.join(getEnvPath(chainId), nodeName, 'nodekey');
  const enodeCommand = `bootnode -nodekey "${nodekeyPath}" -writeaddress`;

  const promise = execAsync(enodeCommand)
    .then((result) => {
      node.enode = `enode://${result.stdout.replace(/\n$/, '')}@${nodeName}:30303`;
    })
    .catch((error) => {
      console.error(`Error generating node key for ${nodeName}:`, error);
    });
  return promise;
}

function initNetworkForNode(node: NetworkNode, chainId: number, genesisFilePath: string, dockerImage: string, promises: Promise<void>[]) {
  const nodeName = getNodeName(node);
  const dataDir = path.join(process.cwd(), 'data', `net${chainId}`, `${nodeName}`);

  const command = `docker run --rm -v "${dataDir}:/data/net${chainId}/${node.name}" -v "${genesisFilePath}:/data/net${chainId}/genesis.json" ${dockerImage} init --datadir /data/net${chainId}/${node.name} /data/net${chainId}/genesis.json`;

  promises.push(
    executeCommand(command).then(() => {
      console.log(`Node ${node.name} initialized.`);
    }).catch((error) => {
      console.error(`Failed to initialize node ${node.name}: ${error}`);
    })
  );
}


function initNode(command: string, node: NetworkNode) {
  return executeCommand(command)
    .then(() => {
      console.log(`Node key generated for ${node.name}`);
    })
    .catch((error: any) => {
      console.error(`Error generating node key for ${node.name}:`, error);
    });
}

async function deleteNode(req:Request, res:Response){
  const { id } = req.params;


  if (!id) {
    return res.status(400).json({ error: 'Node ID is required' });
  }

  try {
    const container = await getContainer(id);

    if (!container) {
      return res.status(404).json({ error: 'Node not found' });
    }

    await removeContainer(id);
    res.status(200).json({ message: 'Node deleted', Node: id });
  } catch (error:any) {
    console.error('Error deleting Node:', error);
    res.status(500).json({ error: 'Failed to delete Node', details: error.message });
  }
}

export {
    startNode,
    stopNode,
    restartNode,
    generateDockerCommandForNode,
    createAccount,
    getNodeName,
    generateNodekey,
    generateEnode,    
    initNode,
    initNetworkForNode,
    deleteNode
  };
  