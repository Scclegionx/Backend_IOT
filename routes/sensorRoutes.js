const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const Sensor = require('../models/sensorModel');

router.get('/', sensorController.getAllSensorData);

router.get('/latest', sensorController.getLatestSensorData);



router.get('/range', sensorController.getSensorDataByRange);

router.get('/sort/temperature', sensorController.sortByTemperature);
router.get('/sort/humidity', sensorController.sortByHumidity);
router.get('/sort/light', sensorController.sortByLightValue);
router.get('/sort/timestamp', sensorController.sortByTimestamp);


module.exports = router;
