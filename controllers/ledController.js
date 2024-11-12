const mqttClient = require('../utils/mqtt');
const ActionHistory = require('../models/actionHistoryModel');

const controlLed = (command) => {
    return new Promise((resolve, reject) => {
        mqttClient.publish('ledControl', command, async (err) => {
            if (err) {
                console.error('Error publishing message to MQTT:', err);
                reject(new Error('Failed to send command'));
            } else {
                console.log(`Sent command: ${command} to ledControl`);

                // Parse command to determine device and action
                let device, action;
                if (command === 'on1' || command === 'off1') {
                    device = 'Đèn 1';
                    action = command === 'on1' ? 'On' : 'Off';
                } else if (command === 'on2' || command === 'off2') {
                    device = 'Đèn 2';
                    action = command === 'on2' ? 'On' : 'Off';
                } else if (command === 'on3' || command === 'off3') {
                    device = 'Đèn 3';
                    action = command === 'on3' ? 'On' : 'Off';
                } else if (command === 'on_all' || command === 'off_all') {
                    device = 'All';
                    action = command === 'on_all' ? 'On' : 'Off';
                }

                // Save action to the database
                const timestamp = new Date();
                try {
                    const newAction = new ActionHistory({ device, action, timestamp });
                    await newAction.save();
                    console.log(`Action saved: ${device} - ${action} at ${timestamp}`);
                    resolve(`Command ${command} sent and action saved successfully`);
                } catch (saveError) {
                    console.error('Failed to save action history:', saveError);
                    reject(new Error('Failed to save action history'));
                }
            }
        });
    });
};

module.exports = {
    controlLed,
};
