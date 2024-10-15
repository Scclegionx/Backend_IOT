const mqttClient = require('../utils/mqtt');

const controlLed = (command) => {
    return new Promise((resolve, reject) => {
        mqttClient.publish('ledControl', command, (err) => {
            if (err) {
                console.error('Error publishing message to MQTT:', err);
                reject(new Error('Failed to send command'));
            } else {
                console.log(`Sent command: ${command} to ledControl`);
                resolve(`Command ${command} sent successfully`);
            }
        });
    });
};

module.exports = {
    controlLed,
};
