const Docker = require('dockerode');
const docker = new Docker();

async function createContainer(containerOptions) {
  return await docker.createContainer(containerOptions);
}

async function startContainer(container) {
  return await container.start();
}

async function stopContainer(container) {
  return await container.stop();
}

async function removeContainer(container) {
  return await container.remove();
}

async function listContainers() {
  return await docker.listContainers({ all: true });
}

module.exports = {
  createContainer,
  startContainer,
  stopContainer,
  removeContainer,
  listContainers,
};