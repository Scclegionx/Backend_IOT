const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://tranducscc:j6jYAlDSsfZT398i@iot.7srk5.mongodb.net/';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
