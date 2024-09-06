const articleService = require('../services/article');
const {
	serialize,
	serializeCollection,
	serializeDetail,
} = require('../serializers/article');
const {
	paginated,
	internalError,
	success,
	notFound,
} = require('../utils/responder');

/**
 * Controller to handle fetching a paginated list of articles.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a paginated response with serialized articles.
 */
const index = async (req, res) => {
	try {
		const result = await articleService.index(req);

		return paginated(res, serializeCollection(result), result.meta);
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle fetching a single article by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized article or a not found response.
 */
const show = async (req, res) => {
	try {
		const result = await articleService.show(req.params.id);

		if (!result) {
			return notFound(res, 'Article not found!');
		}

		return success(res, serializeDetail(result));
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle creating a new article.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized new article.
 */
const store = async (req, res) => {
	try {
		const newArticle = await articleService.store(req.body, req.user);

		return success(res, serialize(newArticle), 'Article created!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle updating an existing article by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized updated article or a not found response.
 */
const update = async (req, res) => {
	try {
		const updatedArticle = await articleService.update(
			req.params.id,
			req.body,
			req.user,
		);

		if (!updatedArticle) {
			return notFound(res, 'Article not found!');
		}
		return success(res, serialize(updatedArticle), 'Article updated!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle deleting an article by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response if the article is deleted or a not found response.
 */
const destroy = async (req, res) => {
	try {
		const result = await articleService.destroy(req.params.id);
		if (!result) {
			return notFound(res, 'Article not found!');
		}
		return success(res, null, 'Article deleted!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle toggling the publish status of an article.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized article and a message indicating the new publish status.
 */
const togglePublish = async (req, res) => {
	try {
		const result = await articleService.togglePublish(
			req.params.id,
			req.body,
		);
		if (!result) {
			return notFound(res, 'Article not found!');
		}
		const message =
			req.body.is_published === 'false'
				? 'Article published!'
				: 'Article unpublished!';

		return success(res, serialize(result), message);
	} catch (error) {
		internalError(res, error);
	}
};

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
	togglePublish,
};