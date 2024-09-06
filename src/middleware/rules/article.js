const { body } = require('express-validator');
const prisma = require('../../utils/db');

/**
 * Validates the provided tags by checking if they exist in the database.
 * @param {Array<number>} tags - The array of tag IDs to validate.
 * @throws Will throw an error if any of the tags are invalid.
 * @returns {Promise<void>}
 */
const validateTags = async (tags) => {
	const validTags = await prisma.tag.findMany({
		where: { id: { in: tags } },
	});
	if (validTags.length !== tags.length) {
		throw new Error('Some tags are invalid');
	}
};

/**
 * Validates the provided author ID by checking if it exists and has the role 'AUTHOR'.
 * @param {number} authorId - The ID of the author to validate.
 * @param {object} context - The context object containing the request.
 * @param {object} context.req - The request object.
 * @throws Will throw an error if the author ID is invalid or not provided when required.
 * @returns {Promise<boolean>}
 */
const validateAuthor = async (authorId, { req }) => {
	if (req.user.role === 'ADMIN') {
		if (!authorId) throw new Error('Author ID is required');
		const validAuthor = await prisma.user.findUnique({
			where: { id: authorId, role: 'AUTHOR' },
		});
		if (!validAuthor) throw new Error('Invalid author ID');
	}
	return true;
};

/**
 * Validation rules for storing a new article.
 * @returns {Array} An array of validation rules.
 */
const storeRules = () => [
	body('title').notEmpty().withMessage('Title is required'),
	body('content').notEmpty().withMessage('Content is required'),
	body('tags')
		.isArray()
		.withMessage('Tags must be an array')
		.notEmpty()
		.withMessage('Tags are required')
		.custom(validateTags),
	body('publish_date').optional(),
	body('author_id').custom(validateAuthor),
];

/**
 * Validation rules for updating an existing article.
 * @returns {Array} An array of validation rules.
 */
const updateRules = () => [
	body('title').optional().notEmpty().withMessage('Title is required'),
	body('content').optional().notEmpty().withMessage('Content is required'),
	body('tags')
		.isArray()
		.withMessage('Tags must be an array')
		.notEmpty()
		.withMessage('Tags are required')
		.custom(validateTags),
	body('publish_date').optional(),
	body('author_id').custom(validateAuthor),
];

module.exports = { storeRules, updateRules };