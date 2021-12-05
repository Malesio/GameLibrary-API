const mongoose = require('mongoose');

require('dotenv').config();

module.exports = async () => {
    const options = {
        authSource: process.env.MONGO_AUTHSOURCE,
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD
    }
    await mongoose.connect(process.env.MONGO_URL, options);
}