import express, { Request, Response } from 'express';
import { createNetwork, stopNetwork, startNetwork, listNetworks } from './networkService';
import { containersInfo } from './dockerService';

const router = express.Router();

router.post('/network', (req: Request, res: Response) => createNetwork(req, res));
router.post('/network/:id/stop', (req: Request, res: Response) => stopNetwork(req, res));
// router.post('/network/:id/reset', (req: Request, res: Response) => resetNetwork(req, res));
router.post('/network/:id/start', (req: Request, res: Response) => startNetwork(req, res));
router.get('/networks', (req: Request, res: Response) => listNetworks(req, res));
router.get('/containers', (req: Request, res: Response) => containersInfo(req, res));

export default router;
