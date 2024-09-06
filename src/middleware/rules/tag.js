const { body } = require('express-validator');
const prisma = require('../../utils/db');

/**
 * Checks if a tag with the given title already exists in the database.
 * @param {string} title - The title of the tag to check.
 * @param {number|null} [id=null] - The ID of the tag to exclude from the check (used for updates).
 * @returns {Promise<void>} - A promise that resolves if the tag does not exist, or rejects with an error message if it does.
 */
const checkTitleExists = async (title, id = null) => {
	const whereClause = {
		title: {
			equals: title,
			mode: 'insensitive',
		},
	};

	if (id) {
		whereClause.id = {
			not: parseInt(id),
		};
	}

	const existed = await prisma.tag.count({ where: whereClause });
	if (existed > 0) {
		return Promise.reject('Tag already exists');
	}
};

/**
 * Validation rules for storing a new tag.
 * @returns {Array} An array of validation rules.
 */
const storeRules = () => [
	body('title')
	.exists().withMessage('Title is required')
	.isString().withMessage('Title must be a string')
	.custom(title => checkTitleExists(title)),
];

/**
 * Validation rules for updating an existing tag.
 * @returns {Array} An array of validation rules.
 */
const updateRules = () => [
	body('title')
	.optional()
	.isString().withMessage('Title must be a string')
	.custom((title, { req }) => checkTitleExists(title, req.params.id)),
];

module.exports = { storeRules, updateRules };