const UserService = require('../services/user');
const {
	serialize,
	serializeCollection,
	serializeDetail,
} = require('../serializers/user');
const {
	success,
	paginated,
	created,
	notFound,
	internalError
} = require('../utils/responder');

/**
 * Controller to handle fetching a paginated list of users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a paginated response with serialized users.
 */
const index = async (req, res) => {
	try {
		const users = await UserService.index(req.query);

		return paginated(res, serializeCollection(users), users.meta);
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle fetching a single user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized user or a not found response.
 */
const show = async (req, res) => {
	try {
		const user = await UserService.show(req.params.id);

		if (!user) {
			return notFound(res, 'User not found!');
		}

		return success(res, serializeDetail(user));
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle creating a new user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a created response with the serialized new user.
 */
const store = async (req, res) => {
	try {
		const newUser = await UserService.store(req.body);

		return created(res, serialize(newUser), 'User created!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle updating an existing user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the serialized updated user or a not found response.
 */
const update = async (req, res) => {
	try {
		const user = await UserService.update(req.params.id, req.body);

		if (!user) {
			return notFound(res, 'User not found!');
		}

		return success(res, serialize(user), 'User updated!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle deleting a user by ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response if the user is deleted or a not found response.
 */
const destroy = async (req, res) => {
	try {
		const result = await UserService.destroy(req.params.id);

		if (!result) {
			return notFound(res, 'User not found!');
		}

		return success(res, null, 'User deleted!');
	} catch (error) {
		internalError(res, error);
	}
};

/**
 * Controller to handle fetching select options for authors.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a success response with the select options.
 */
const authorSelectOptions = async (req, res) => {
	try {
		const authors = UserService.authorSelectOptions();

		return success(res, authors);
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
	authorSelectOptions,
};