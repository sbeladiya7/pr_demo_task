const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require('./routes/users');

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ extended: true, limit: '50mb' }));

app.use(cors());

app.use('/', userRoutes);

app.get('/', (req, res) => res.send('auth-service is running!'))

app.use('/*', (req, res, next) => {
    res.status(404).json({
        message: 'not found'
    })
});

const PORT = process.env.PORT || 8001;
mongoose.connect(process.env.DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("auth-service database connected");
    app.listen(PORT, () => {
        console.log(`auth-service is running on port : ${PORT}`);
    });
});
