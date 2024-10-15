// Kết nối tới MongoDB và thêm dữ liệu vào bảng ActionHistory

const mongoose = require('mongoose');
const ActionHistory = require('../models/actionHistoryModel'); // Đảm bảo đường dẫn tới model đúng

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://tranducscc:j6jYAlDSsfZT398i@iot.7srk5.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    seedActionHistory();
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Dữ liệu mẫu để thêm vào ActionHistory
const actionHistoryData = [
    {
        device: 'Đèn 1',
        action: 'On',
        timestamp: new Date('2024-10-10T08:30:00')
    },
    {
        device: 'Đèn 2',
        action: 'Off',
        timestamp: new Date('2024-10-10T09:00:00')
    },
    {
        device: 'Đèn 3',
        action: 'On',
        timestamp: new Date('2024-10-10T09:30:00')
    },
    {
        device: 'Đèn 1',
        action: 'Off',
        timestamp: new Date('2024-10-11T10:00:00')
    },
    {
        device: 'Đèn 2',
        action: 'On',
        timestamp: new Date('2024-10-11T11:00:00')
    },
    {
        device: 'Đèn 3',
        action: 'Off',
        timestamp: new Date('2024-10-11T12:00:00')
    }
];

// Hàm để thêm dữ liệu vào MongoDB
async function seedActionHistory() {
    try {
        await ActionHistory.insertMany(actionHistoryData); // Thêm tất cả dữ liệu mẫu vào bảng ActionHistory
        console.log('Data inserted successfully');
        mongoose.connection.close(); // Đóng kết nối sau khi thêm dữ liệu
    } catch (err) {
        console.error('Error inserting data', err);
    }
}
