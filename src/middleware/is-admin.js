const { forbidden } = require('../utils/responder');

/**
 * Middleware to check if the user has an admin role.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
const checkIfAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'ADMIN') {
		next();
	} else {
		return forbidden(res, 'Access denied. Admin only!');
	}
};

module.exports = {
	checkIfAdmin,
};