require('dotenv-safe').config({
  allowEmptyValues: true
});
const express = require('express');
const helmet = require('helmet');
const compress = require('compression');
const cors = require('cors');
const path = require('path');

const logger = require('./lib/logger');
const errorHandlers = require('./middlewares/errorHandlers');
const routes = require('./routes/v1/index');

const port = process.env.PORT || 8080;

/**
 * Express instance
 * @public
 */
const app = express();
// parse body params
app.use(express.json());
// gzip compression
app.use(compress());
// secure app by setting various HTTP headers
app.use(helmet());
app.use(helmet.hidePoweredBy());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// middleware to serve static files
app.use(express.static(path.join(__dirname, '/../public/')));

// mount api/v1
app.use('/api/v1', routes);

// error handler, send stacktrace only during development
app.use(errorHandlers);
app.listen(port, () => logger.info(`Running on port ${port} env ${process.env.NODE_ENV}`));