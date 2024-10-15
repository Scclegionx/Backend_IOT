const express = require('express');
const mongoose = require('./utils/db');
const sensorRoutes = require('./routes/sensorRoutes');
const mqttClient = require('./utils/mqtt');
const ledRoutes = require('./routes/ledRoutes');

// Khởi tạo ứng dụng Express
const app = express();
app.use(express.json());

// Hàm để thay thế các giá trị NaN thành -100
function replaceNaNWithNegative(jsonString) {
    return jsonString.replace(/nan/g, '-100');
}


mqttClient.on('message', (topic, message) => {
    try {
        console.log(`Received message from ${topic}: ${message}`);

        // Chuyển message từ Buffer sang chuỗi và thay thế NaN thành -100
        const messageString = message.toString();
        const validMessageString = replaceNaNWithNegative(messageString);

        // Parse chuỗi JSON đã được thay thế NaN bằng -100
        const sensorData = JSON.parse(validMessageString);

        // Gọi hàm lưu dữ liệu vào MongoDB
        const sensorController = require('./controllers/sensorController');
        sensorController.saveSensorData(sensorData);

    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
});


app.use('/api/sensors', sensorRoutes);
app.use('/api/led', ledRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
