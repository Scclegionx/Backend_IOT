const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://192.168.1.36:1234', {
    username: 'B21DCCN166',
    password: '123456',
});

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('dulieu');
});

module.exports = mqttClient;
