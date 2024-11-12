const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const Sensor = require('../models/sensorModel');

router.get('/', sensorController.getAllSensorData);

router.get('/latest', sensorController.getLatestSensorData);



router.get('/range', sensorController.getSensorDataByRange);

router.get('/sort', sensorController.getSortedAndPaginatedData);





module.exports = router;
