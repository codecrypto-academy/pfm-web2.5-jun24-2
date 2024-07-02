const express = require('express');
const { createNetwork, stopNetwork, startNetwork, listNetworks } = require('./networkService');
const { containersInfo } = require('./dockerService');

const router = express.Router();

router.post('/network', createNetwork);
router.post('/network/:id/stop', stopNetwork);
//router.post('/network/:id/reset', resetNetwork);
router.post('/network/:id/start', startNetwork);
router.get('/networks', listNetworks);
router.get('/containers', containersInfo);

module.exports = router;