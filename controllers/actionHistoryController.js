const ActionHistory = require('../models/actionHistoryModel');
const moment = require('moment-timezone');

// Hàm save - Lưu dữ liệu vào database
exports.save = async (req, res) => {
    try {
        const { device, action, timestamp } = req.body;

        const utcTimestamp = moment(timestamp).tz("Asia/Ho_Chi_Minh").utc().toDate();

        const newAction = new ActionHistory({ device, action, timestamp: utcTimestamp });
        await newAction.save();
        res.status(201).json(newAction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save action history' });
    }
};

// Hàm getAll - Lấy tất cả dữ liệu để gửi lên frontend
exports.getAll = async (req, res) => {
    try {
        const actionHistories = await ActionHistory.find();
        const localActions = actionHistories.map(actionHistory => ({
            ...actionHistory.toObject(),
            timestamp: moment(actionHistory.timestamp).tz("Asia/Ho_Chi_Minh").format()
        }));
        res.json(localActions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve action histories' });
    }
};

// Hàm sortByTimestamp - Sắp xếp và phân trang theo timestamp
exports.sortByTimestamp = async (req, res) => {
    try {
        const { order = 'asc', page = 1 } = req.query;
        const sortOrder = order === 'desc' ? -1 : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const actionHistories = await ActionHistory.find()
            .sort({ timestamp: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalRecords = await ActionHistory.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({ data: actionHistories, totalPages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sort by timestamp' });
    }
};

// Hàm range - Lọc theo timestamp và phân trang
exports.range = async (req, res) => {
    try {
        const { start, end, page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (start) {
            filter.timestamp = {
                $gte: new Date(start + 'Z')
            };
        }
        if (end) {
            filter.timestamp = {
                ...filter.timestamp,  // Giữ nguyên điều kiện min nếu có
                $lte: new Date(end + 'Z')
            };
        }

        console.log(filter)

        const actionHistories = await ActionHistory.find(filter)
            .sort({ timestamp: 1 })  // Luôn sắp xếp tăng dần
            .skip(skip)
            .limit(limit);

        const totalRecords = await ActionHistory.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({ data: actionHistories, totalPages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter by timestamp range' });
    }
};
