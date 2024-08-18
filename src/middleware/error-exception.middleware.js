const {
	unauthorized,
	internalError,
} = require('../utils/responder');

/**
 * Middleware to handle errors and send appropriate responses.
 * @param {object} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {void}
 */
const errorHandler = (err, req, res) => {
	if (err.name === 'UnauthorizedError') {
		return unauthorized(res, 'Unauthorized access');
	}

	internalError(res, err);
};

module.exports = { errorHandler };