const { validationResult } = require('express-validator');
const { unprocessable } = require('../utils/responder');

/**
 * Middleware to validate the request using express-validator.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {

		// Format errors
		let formatedErrors = {};
		let errorArray = errors.array();

		errorArray.forEach((error) => {
			Object.assign(formatedErrors, {
				[error.path]: error.msg,
			});
		});

		return unprocessable(res, 'Validation failed', formatedErrors);
	} else {
		next();
	}
};

module.exports = { validate };