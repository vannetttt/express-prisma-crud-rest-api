const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { endPointNotFoundMiddleware } = require('./src/middleware/not-found.middleware');
const { errorHandler } = require('./src/middleware/error-exception.middleware');
const { verifyToken } = require('./src/middleware/auth.middleware');

// Register environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const webapp = express();
webapp.use('/public', express.static(path.join(__dirname, 'src/assets')));
webapp.use(express.json());

// Allow CORS from the specified origin
webapp.use(cors({ origin: process.env.CORS_ORIGIN }));

webapp.get('/', (req, res) => res.send('Hello World!'));

// Exclude public routes from token verification
const publicRoutes = ['/api/login', '/api/author/register'];
webapp.use((req, res, next) => publicRoutes.includes(req.path) ? next() : verifyToken(req, res, next));

const registerRoutes = (app) => {
	const routesPath = path.join(__dirname, 'src/routes');
	fs.readdirSync(routesPath).forEach((file) => {
		if (file.endsWith('.js')) {
			app.use('/api/', require(path.join(routesPath, file)));
		}
	});
};

registerRoutes(webapp);

// Handle 404 and error
webapp.use('/', endPointNotFoundMiddleware);

// Catch unhandled errors
webapp.use(errorHandler);

webapp.listen(process.env.PORT, () => console.log(`Running on: http://localhost:${process.env.PORT}`));