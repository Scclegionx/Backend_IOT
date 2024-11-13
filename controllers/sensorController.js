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

exports.getTodaySensorData = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayData = await Sensor.find({ timestamp: { $gte: startOfDay } }).sort({ timestamp: 1 });
        res.json(todayData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Sort and paginated

exports.getSortedAndPaginatedData = async (req, res) => {
    try {
        const { field = 'temperature', order = 'asc', page = 1, limit = 5 } = req.query; // Các tham số sắp xếp và phân trang
        const validFields = ['temperature', 'humidity', 'light_value', 'timestamp']; // Các trường hợp cho phép

        // Kiểm tra trường hợp không hợp lệ
        if (!validFields.includes(field)) {
            return res.status(400).json({ error: 'Invalid sort field' });
        }

        // Xác định thứ tự sắp xếp
        const sortOrder = order === 'desc' ? -1 : 1;

        // Lấy và phân trang
        const sensors = await Sensor.find()
            .sort({ [field]: sortOrder })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        // Đếm tổng số bản ghi để tính số trang
        const totalRecords = await Sensor.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            data: sensors,
            currentPage: parseInt(page),
            totalPages,
        });
    } catch (error) {
        console.error(`Error fetching sorted and paginated data:`, error);
        res.status(500).json({ error: 'Failed to fetch sorted and paginated data' });
    }
};


// sensorData Range

exports.getSensorDataByRange = async (req, res) => {
    const {
        start, end, minTemperature, maxTemperature, minHumidity, maxHumidity, minLight, maxLight,
        page = 1, limit = 5
    } = req.query;

    let filterConditions = {};

    // Lọc theo thời gian
    if (start) {
        filterConditions.timestamp = {
            $gte: new Date(start + 'Z')
        };
    }
    if (end) {
        filterConditions.timestamp = {
            ...filterConditions.timestamp,  // Giữ nguyên điều kiện min nếu có
            $lte: new Date(end + 'Z')
        };
    }


    // Lọc theo nhiệt độ nếu có min hoặc max
    if (minTemperature) {
        filterConditions.temperature = {
            $gte: Number(minTemperature) // Lọc các bản ghi có nhiệt độ lớn hơn hoặc bằng minTemperature
        };
    }
    if (maxTemperature) {
        filterConditions.temperature = {
            ...filterConditions.temperature,  // Giữ nguyên điều kiện min nếu có
            $lte: Number(maxTemperature) // Lọc các bản ghi có nhiệt độ nhỏ hơn hoặc bằng maxTemperature
        };
    }

    // Lọc theo độ ẩm nếu có min hoặc max
    if (minHumidity) {
        filterConditions.humidity = {
            $gte: Number(minHumidity) // Lọc các bản ghi có độ ẩm lớn hơn hoặc bằng minHumidity
        };
    }
    if (maxHumidity) {
        filterConditions.humidity = {
            ...filterConditions.humidity,  // Giữ nguyên điều kiện min nếu có
            $lte: Number(maxHumidity) // Lọc các bản ghi có độ ẩm nhỏ hơn hoặc bằng maxHumidity
        };
    }

    // Lọc theo giá trị ánh sáng nếu có min hoặc max
    if (minLight) {
        filterConditions.light_value = {
            $gte: Number(minLight) // Lọc các bản ghi có giá trị ánh sáng lớn hơn hoặc bằng minLight
        };
    }
    if (maxLight) {
        filterConditions.light_value = {
            ...filterConditions.light_value,  // Giữ nguyên điều kiện min nếu có
            $lte: Number(maxLight) // Lọc các bản ghi có giá trị ánh sáng nhỏ hơn hoặc bằng maxLight
        };
    }

    console.log(filterConditions);

    try {
        // Lấy dữ liệu đã lọc và phân trang
        const sensors = await Sensor.find(filterConditions)
            .skip((parseInt(page) - 1) * parseInt(limit))  // Phân trang
            .limit(parseInt(limit));  // Giới hạn số bản ghi trả về

        // Tính tổng số bản ghi và số trang
        const totalRecords = await Sensor.countDocuments(filterConditions);
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            data: sensors,
            currentPage: parseInt(page),
            totalPages
        });
    } catch (error) {
        console.error('Error fetching data with range and pagination:', error);
        res.status(500).json({ error: 'Error fetching data with range and pagination' });
    }
};



