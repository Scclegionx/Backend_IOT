const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    light_value: Number,
    light_percent: Number,
    timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
