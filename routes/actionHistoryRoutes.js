const express = require('express');
const router = express.Router();
const actionHistoryController = require('../controllers/actionHistoryController');



router.get('/getAll', actionHistoryController.getAll);


router.get('/sortByTimestamp', actionHistoryController.sortByTimestamp);


router.get('/range', actionHistoryController.range);


module.exports = router;
