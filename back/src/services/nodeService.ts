import { Request, Response } from 'express';
import { getContainer, listContainers, restartContainer, startContainer, stopContainer } from "./dockerService";

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

export {
    startNode,
    stopNode,
    restartNode
  };
  