const tagService = require('../services/tag');
const { serialize, serializeCollection } = require('../serializers/tag');
const {
	paginated,
	internalError,
	success,
	created,
	badRequest,
	notFound
} = require('../utils/responder');

/**
 * Controller to handle fetching a paginated list of tags.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a paginated response with serialized tags.
 */
const index = async (req, res) => {
	try {
		let result = await tagService.index(req.query);

		return paginated(res, serializeCollection(result), result.meta);
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle fetching a single tag by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized tag or a not found response.
 */
const show = async (req, res) => {
	try {
		const tagId = parseInt(req.params.id);
		const result = await tagService.show(tagId);

		if (!result) {
			return notFound(res, 'Tag not found!');
		}

		return success(res, serialize(result));
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle creating a new tag.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a created response with the serialized new tag.
 */
const store = async (req, res) => {
	try {
		const newTag = await tagService.store(req.body);

		return created(res, serialize(newTag));
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle updating an existing tag by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized updated tag or a not found response.
 */
const update = async (req, res) => {
	try {
		const tagId = parseInt(req.params.id);
		const updatedTag = await tagService.update(tagId, req.body);

		if (!updatedTag) {
			return notFound(res, 'Tag not found!');
		}

		return success(res, serialize(updatedTag));
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle deleting a tag by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response if the tag is deleted or a bad request response.
 */
const destroy = async (req, res) => {
	try {
		const tagId = req.params.id;
		const result = await tagService.destroy(tagId);

		if (!result) {
			return badRequest(res, 'Failed to delete tag');
		}

		return success(res, null, 'Tag deleted successfully');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle fetching select options for tags.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the select options.
 */
const selectOptions = async (req, res) => {
	try {
		const result = tagService.selectOptions();

		return success(res, result);
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
	selectOptions,
};