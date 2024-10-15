const express = require('express');
const router = express.Router();
const actionHistoryController = require('../controllers/actionHistoryController');


router.get('/sort/timestamp', actionHistoryController.sortByTimestamp);


module.exports = router;
