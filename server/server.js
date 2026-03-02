require('dotenv').config();
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB();

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App is running... on localhost:${PORT}`);
})