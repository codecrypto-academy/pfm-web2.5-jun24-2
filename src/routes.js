const express = require('express');
const { createNetwork, stopNetwork, resetNetwork, startNetwork, listNetworks } = require('./networkService');

const router = express.Router();

router.post('/network', createNetwork);
router.post('/network/:id/stop', stopNetwork);
router.post('/network/:id/reset', resetNetwork);
router.post('/network/:id/start', startNetwork);
router.get('/networks', listNetworks);

module.exports = router;