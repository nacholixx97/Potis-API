const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { customErrorMiddleware } = require('./middlewares/errorsHandler');
const ErrorHandler = require('./helpers/errorHandler');
const apiRoutes = require('./routes/api');

const { PORT, NODE_ENV } = process.env;

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));
app.use(cookieParser());

// Show routes called in console during development
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (NODE_ENV === 'production') {
    app.use(helmet());
}

app.use('/api', apiRoutes);

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`No se ha podido resolver ${req.originalUrl} en el servidor!`, 404));
});

app.use(customErrorMiddleware);

app.listen(PORT, () => { console.log(`Listening on port ${PORT}, environment ${NODE_ENV}`); });

module.exports = app;

// Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    process.exit(1);
});
