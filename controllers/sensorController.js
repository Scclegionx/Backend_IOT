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


// Sort

exports.sortByTemperature = async (req, res) => {
    try {
        const { order = 'asc' } = req.query; // Nhận order từ query, mặc định là 'asc'

        const sortOrder = order === 'desc' ? -1 : 1; // Nếu order là 'desc', dùng -1, còn lại là 1
        const sensors = await Sensor.find().sort({ temperature: sortOrder });

        res.json(sensors);
    } catch (error) {
        console.error('Error sorting by temperature:', error);
        res.status(500).json({ error: 'Failed to sort by temperature' });
    }
};

exports.sortByHumidity = async (req, res) => {
    try {
        const { order = 'asc' } = req.query; // Nhận order từ query, mặc định là 'asc'

        const sortOrder = order === 'desc' ? -1 : 1; // Nếu order là 'desc', dùng -1, còn lại là 1
        const sensors = await Sensor.find().sort({ humidity: sortOrder });

        res.json(sensors);
    } catch (error) {
        console.error('Error sorting by humidity:', error);
        res.status(500).json({ error: 'Failed to sort by humidity' });
    }
};

exports.sortByLightValue = async (req, res) => {
    try {
        const { order = 'asc' } = req.query; // Nhận order từ query, mặc định là 'asc'

        const sortOrder = order === 'desc' ? -1 : 1; // Nếu order là 'desc', dùng -1, còn lại là 1
        const sensors = await Sensor.find().sort({ light_value: sortOrder });

        res.json(sensors);
    } catch (error) {
        console.error('Error sorting by light_value:', error);
        res.status(500).json({ error: 'Failed to sort by light_value' });
    }
};

exports.sortByTimestamp = async (req, res) => {
    try {
        const { order = 'asc' } = req.query; // Nhận order từ query, mặc định là 'asc'

        const sortOrder = order === 'desc' ? -1 : 1; // Nếu order là 'desc', dùng -1, còn lại là 1
        const sensors = await Sensor.find().sort({ timestamp: sortOrder });

        res.json(sensors);
    } catch (error) {
        console.error('Error sorting by timestamp:', error);
        res.status(500).json({ error: 'Failed to sort by timestamp' });
    }
};

// sensorData Range

exports.getSensorDataByRange = async (req, res) => {
    const { start, end, minTemperature, maxTemperature, minHumidity, maxHumidity, minLight, maxLight } = req.query;

    // Tạo object để chứa các điều kiện lọc
    let filterConditions = {};

    // Nếu có tham số start và end (khoảng thời gian)
    if (start && end) {
        filterConditions.timestamp = {
            $gte: new Date(start),
            $lte: new Date(end)
        };
    }

    // Nếu có tham số minTemperature và maxTemperature (khoảng nhiệt độ)
    if (minTemperature && maxTemperature) {
        filterConditions.temperature = {
            $gte: Number(minTemperature),
            $lte: Number(maxTemperature)
        };
    }

    // Nếu có tham số minHumidity và maxHumidity (khoảng độ ẩm)
    if (minHumidity && maxHumidity) {
        filterConditions.humidity = {
            $gte: Number(minHumidity),
            $lte: Number(maxHumidity)
        };
    }

    // Nếu có tham số minLight và maxLight (khoảng ánh sáng)
    if (minLight && maxLight) {
        filterConditions.light_value = {
            $gte: Number(minLight),
            $lte: Number(maxLight)
        };
    }

    try {
        // Lấy dữ liệu từ MongoDB dựa trên các điều kiện lọc
        const sensors = await Sensor.find(filterConditions);
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data with multiple conditions' });
    }
};
