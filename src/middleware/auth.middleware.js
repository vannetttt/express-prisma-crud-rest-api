const jwt = require('jsonwebtoken');
const prisma = require('../utils/db.js');
const { internalError, unauthorized } = require('../utils/responder');

/**
 * Middleware to verify the JWT token from the request header.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
const verifyToken = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization');
		if (!authHeader) return unauthorized(res, 'Access denied. No token provided.');

		const token = authHeader.split(' ')[1];
		if (!token) return unauthorized(res, 'Access denied. No token provided.');

		const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
		if (!decoded) return unauthorized(res, 'Invalid token!');

		const user = await prisma.user.findUnique({ where: { id: Number(decoded.userId) } });
		if (!user) return unauthorized(res, 'Invalid token!');

		req.user = { id: user.id, username: user.username, role: user.role };
		next();
	} catch (error) {
		if (['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) {
			return unauthorized(res, error.name === 'TokenExpiredError' ? 'Token expired!' : 'Invalid token!');
		}
		return internalError(res, error);
	}
};

module.exports = { verifyToken };