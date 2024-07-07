import express, { Request, Response } from 'express';
import { createNetwork, stopNetwork, startNetwork, listNetworks } from './services/networkService';
import { containersInfo } from './services/dockerService';

const router = express.Router();

//Add networks or nodes
router.post('/network', (req: Request, res: Response) => createNetwork(req, res));
//router.post('/network/:id/node', (req: Request, res: Response) => createNode(req, res));

// Network endpoints
router.post('/network/:id/stop', (req: Request, res: Response) => stopNetwork(req, res));
router.post('/network/:id/start', (req: Request, res: Response) => startNetwork(req, res));
//router.post('/network/:id/restart', (req: Request, res: Response) => restartNetwork(req, res));
router.get('/networks', (req: Request, res: Response) => listNetworks(req, res));

// nodes endpoints
// router.post('/node/:id/stop', (req: Request, res: Response) => stopNode(req, res));
// router.post('/node/:id/start', (req: Request, res: Response) => startNetwork(req, res));
// router.post('/node/:id/restart', (req: Request, res: Response) => restartNetwork(req, res));
// router.get('/network/:id/nodes', (req: Request, res: Response) => listNetworks(req, res));


router.get('/containers', (req: Request, res: Response) => containersInfo(req, res));

export default router;
