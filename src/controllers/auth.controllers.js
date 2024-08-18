const prisma = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	success,
	internalError,
	unauthorized,
	unprocessable,
} = require('../utils/responder');

/**
 * Login controller to authenticate a user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with a JWT token or an error response.
 */
const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return unprocessable(res, 'Email and password are required');
		}

		const user = await prisma.user.findFirst({ where: { email } });
		if (!user) {
			return unauthorized(res, 'Invalid credentials');
		}

		const matchPassword = await bcrypt.compare(password, user.password);
		if (matchPassword) {
			const token = jwt.sign(
				{ userId: user.id },
				process.env.SECRET_ACCESS_TOKEN,
				{ expiresIn: '1h' },
			);

			return success(res, { token });
		}

		return unauthorized(res, 'Invalid credentials!');
	} catch (e) {
		return internalError(res, e);
	}
};

/**
 * Get current user information.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the user information.
 */
const getMe = (req, res) => {
	return success(res, req.user);
};

/**
 * Register a new author.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with a JWT token or an error response.
 */
const authorRegister = async (req, res) => {
	try {
		const { email, password, username } = req.body;
		if (!email || !password || !username) {
			return unprocessable(res, 'Email, password, and username are required');
		}

		const user = await prisma.user.findFirst({ where: { email } });
		if (user) {
			return unprocessable(res, 'Email is already taken');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				username,
			},
		});

		const token = jwt.sign(
			{ userId: newUser.id },
			process.env.SECRET_ACCESS_TOKEN,
			{ expiresIn: '1h' },
		);

		return success(res, { token });
	} catch (e) {
		return internalError(res, e);
	}
};

module.exports = {
	login,
	getMe,
	authorRegister,
};