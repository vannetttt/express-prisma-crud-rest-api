/**
 * Sends a response with the given status code, message, body, and meta information.
 * @param {object} res - The response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The response message.
 * @param {object|null} [body=null] - The response body.
 * @param {object|null} [meta=null] - The meta information.
 */
const sendResponse = (res, statusCode, message, body = null, meta = null) => {
	res.status(statusCode).send({
		status_code: statusCode,
		message,
		data: body,
		meta,
	});
};

/**
 * Sends an internal server error response.
 * @param {object} res - The response object.
 * @param {Error} error - The error object.
 */
const internalError = (res, error) => {
	const mode = process.env.NODE_ENV ?? 'development';
	const message =
		mode === 'production' ? 'Internal Server Error' : error.message;
	const body = mode === 'production' ? null : error.stack;

	sendResponse(res, 500, message, body);
};

/**
 * Sends a not found response.
 * @param {object} res - The response object.
 * @param {string} [msg='Not Found!'] - The response message.
 */
const notFound = (res, msg = 'Not Found!') => sendResponse(res, 404, msg);

/**
 * Sends a bad request response.
 * @param {object} res - The response object.
 * @param {string} [msg='Bad Request!'] - The response message.
 */
const badRequest = (res, msg = 'Bad Request!') => sendResponse(res, 400, msg);

/**
 * Sends an unauthorized response.
 * @param {object} res - The response object.
 * @param {string} [msg='Unauthorized!'] - The response message.
 */
const unauthorized = (res, msg = 'Unauthorized!') =>
	sendResponse(res, 401, msg);

/**
 * Sends a forbidden response.
 * @param {object} res - The response object.
 * @param {string} [msg='Forbidden!'] - The response message.
 */
const forbidden = (res, msg = 'Forbidden!') => sendResponse(res, 403, msg);

/**
 * Sends an unprocessable entity response.
 * @param {object} res - The response object.
 * @param {string} [msg='Unprocessable Entity!'] - The response message.
 * @param {object|null} [meta=null] - The meta information.
 */
const unprocessable = (res, msg = 'Unprocessable Entity!', meta = null) =>
	sendResponse(res, 422, msg, null, meta);

/**
 * Sends a success response.
 * @param {object} res - The response object.
 * @param {object} data - The response data.
 * @param {string} [msg='Success!'] - The response message.
 */
const success = (res, data, msg = 'Success!') =>
	sendResponse(res, 200, msg, data);

/**
 * Sends a created response.
 * @param {object} res - The response object.
 * @param {object} data - The response data.
 * @param {string} [msg='Created!'] - The response message.
 */
const created = (res, data, msg = 'Created!') =>
	sendResponse(res, 201, msg, data);

/**
 * Sends a paginated response.
 * @param {object} res - The response object.
 * @param {object} data - The response data.
 * @param {object} pagination - The pagination information.
 * @param {string} [msg='Fetched!'] - The response message.
 */
const paginated = (res, data, pagination, msg = 'Fetched!') =>
	sendResponse(res, 200, msg, data, pagination);

module.exports = {
	internalError,
	notFound,
	badRequest,
	unauthorized,
	forbidden,
	unprocessable,
	success,
	created,
	paginated,
};