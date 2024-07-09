import Docker from 'dockerode';
import { Request, Response } from 'express';

const docker = new Docker();

interface ContainerOptions {
  Image: string;
  Cmd?: string[];
  [key: string]: any;
}

async function createContainer(containerOptions: ContainerOptions) {
  return await docker.createContainer(containerOptions);
}

async function startContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  return await container.start();
}

async function stopContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  return await container.stop();
}

async function restartContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  return await container.restart();
}

async function removeContainer(containerId: string) {
  const container = docker.getContainer(containerId);

  try {
    // Intentar detener el contenedor primero
    await container.stop();
    console.log(`Container ${containerId} stopped successfully.`);
  } catch (stopError: any) {
    console.error(`Failed to stop container ${containerId}. It may already be stopped. Error: ${stopError.message}`);
  }

  try {
    // Luego intentar eliminar el contenedor
    await container.remove();
    console.log(`Container ${containerId} removed successfully.`);
  } catch (removeError: any) {
    console.error(`Failed to remove container ${containerId}. Error: ${removeError.message}`);
    throw removeError;
  }
}

async function listContainers() {
  return await docker.listContainers({ all: true });
}

async function getContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  return await container.inspect();
}

async function containersInfo(req: Request, res: Response) {
  try {
    const containers = await listContainers();
    res.status(200).json(containers);
  } catch (error:any) {
    res.status(500).json({ error: 'Failed to retrieve container info', details: error.message });
  }
}

export {
  createContainer,
  startContainer,
  stopContainer,
  restartContainer,
  removeContainer,
  listContainers,
  getContainer,
  containersInfo
};
