const { body } = require('express-validator');

/**
 * Validation rules for storing a new user.
 * @returns {Array} An array of validation rules.
 */
const storeRules = () => {
	return [
		body('username').notEmpty().withMessage('User name is required'),
		body('email').isEmail().withMessage('Invalid email address'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters long'),
	];
};

/**
 * Validation rules for updating an existing user.
 * @returns {Array} An array of validation rules.
 */
const updateRules = () => {
	return [
		body('username')
			.optional()
			.notEmpty()
			.withMessage('User name must not be empty'),
		body('email').optional().isEmail().withMessage('Invalid email address'),
		body('password')
			.optional()
			.custom((value) => {
				if (value) {
					if (value.length < 6) {
						throw new Error(
							'Password must be at least 6 characters long'
						);
					}
				}
				return true;
			}),
	];
};

module.exports = {
	storeRules,
	updateRules,
};
