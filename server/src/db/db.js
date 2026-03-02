require('dotenv').config();
const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to DB...');
    } catch(err){
        console.error('Error connecting to DB:', err.message);
    }
}

module.exports = connectDB;