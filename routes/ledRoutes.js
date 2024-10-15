const express = require('express');
const router = express.Router();
const ledController = require('../controllers/ledController');

router.post('/control', async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Command is required' });
    }

    try {
        const message = await ledController.controlLed(command);
        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
