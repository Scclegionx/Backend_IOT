const express = require('express');
const mongoose = require('./utils/db');
const sensorRoutes = require('./routes/sensorRoutes');
const mqttClient = require('./utils/mqtt');
const ledRoutes = require('./routes/ledRoutes');
const ahRoutes = require('./routes/actionHistoryRoutes');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


function replaceNaNWithNegative(jsonString) {
    return jsonString.replace(/nan/g, '-100');
}


mqttClient.on('message', (topic, message) => {
    try {
        console.log(`Received message from ${topic}: ${message}`);

        const messageString = message.toString();
        const validMessageString = replaceNaNWithNegative(messageString);

        const sensorData = JSON.parse(validMessageString);

        // const sensorController = require('./controllers/sensorController');
        // sensorController.saveSensorData(sensorData);

    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
});


app.use('/api/sensors', sensorRoutes);
app.use('/api/led', ledRoutes);
app.use('/api/actionHistory', ahRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
