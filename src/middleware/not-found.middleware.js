const { notFound } = require('../utils/responder');

/**
 * Middleware to handle requests to non-existent pages.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {void}
 */
const pageNotFoundMiddleware = (req, res) => {
	res.status(404).send('<h1>Page is not found!</h1>');
};

/**
 * Middleware to handle requests to non-existent endpoints.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {void}
 */
const endPointNotFoundMiddleware = (req, res) => {
	notFound(res, 'Endpoint not found!');
};

module.exports = {
	pageNotFoundMiddleware,
	endPointNotFoundMiddleware,
};