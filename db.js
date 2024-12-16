const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://baniewiczszymonn:<db_password>@lab10tbk.giiyp.mongodb.net/?retryWrites=true&w=majority&appName=Lab10TBK');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
