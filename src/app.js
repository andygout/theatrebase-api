import './dotenv.js';

import http from 'node:http';

import express from 'express';
import logger from 'morgan';

import { accessControlSetter, errorHandler } from './middleware/index.js';
import { getDriver as getNeo4jDriver } from './neo4j/get-driver.js';
import router from './router.js';

const app = express();

app.use(
	express.json(),
	logger('dev'),
	accessControlSetter,
	router,
	errorHandler
);

const neo4jDriver = getNeo4jDriver();

const port = '3000';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`)); // eslint-disable-line no-console

const shutDown = () => {
	server.closeAllConnections();
	server.close(() => neo4jDriver.close().then(() => process.exit(0)));
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Export for end-to-end tests.
export default app;
export { shutDown };
