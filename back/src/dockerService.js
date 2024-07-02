const Docker = require('dockerode');
const docker = new Docker();

async function createContainer(containerOptions) {
  return await docker.createContainer(containerOptions);
}

async function startContainer(containerId) {
  const container = docker.getContainer(containerId);
  return await container.start();
}

async function stopContainer(containerId) {
  const container = docker.getContainer(containerId);
  return await container.stop();
}

async function removeContainer(container) {
  return await container.remove();
}

async function listContainers() {
  return await docker.listContainers({ all: true });
}

async function containersInfo(req, res) {
  const containers = await docker.listContainers({ all: true });
  res.status(200).json(containers);
}

module.exports = {
  createContainer,
  startContainer,
  stopContainer,
  removeContainer,
  listContainers,
  containersInfo
};