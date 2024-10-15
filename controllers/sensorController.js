const Sensor = require('../models/sensorModel');

exports.saveSensorData = async (sensorData) => {
    try {
        const data = new Sensor(sensorData);
        await data.save();
        console.log('Sensor data saved to MongoDB');
    } catch (err) {
        console.error('Error saving sensor data:', err);
    }
};

exports.getAllSensorData = async (req, res) => {
    try {
        const data = await Sensor.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLatestSensorData = async (req, res) => {
    try {
        const latestData = await Sensor.findOne().sort({ timestamp: -1 });
        res.json(latestData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
