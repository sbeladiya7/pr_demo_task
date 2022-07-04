const express = require("express");
const app = express();
const cors = require("cors");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");
dotenv.config();

const authRequest = require('./middlewares/authRequest');

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ extended: true, limit: '50mb' }));

app.use(cors());

app.all('/*', authRequest.checkJWTAuthentication);
app.use('/user',
    proxy(`${process.env.BASE_URL}:${process.env.AUTH_SERVICE_PORT}`, // http://localhost:8001
        {
            proxyErrorHandler: function (err, res, next) {
                console.log(err.message)
                return res.status(400).json({
                    message: 'getting error while connecting to auth-service'
                });
            }
        }))

app.get('/', (req, res) => res.send('server is running!'))

app.use('/*', (req, res, next) => {
    res.status(404).json({
        message: 'not found'
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
});
