/**
 * Serializes a single user object.
 * @param {object} data - The user data to serialize.
 * @param {number} data.id - The ID of the user.
 * @param {string} data.username - The username of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.role - The role of the user.
 * @param {Date} data.created_at - The creation date of the user.
 * @param {Date} data.updated_at - The last update date of the user.
 * @returns {object} - The serialized user object.
 */
const serialize = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  role: data.role,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

/**
 * Serializes a collection of users.
 * @param {object} collection - The collection of users to serialize.
 * @param {Array<object>} collection.data - The array of user objects.
 * @returns {Array<object>} - The array of serialized user objects.
 */
const serializeCollection = (collection) =>
  collection.data.map(serialize);

/**
 * Serializes detailed information of a single user.
 * @param {object} data - The user data to serialize.
 * @param {number} data.id - The ID of the user.
 * @param {string} data.username - The username of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.role - The role of the user.
 * @param {Array<object>} data.articles - The articles associated with the user.
 * @param {Date} data.created_at - The creation date of the user.
 * @param {Date} data.updated_at - The last update date of the user.
 * @returns {object} - The serialized detailed user object.
 */
const serializeDetail = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  role: data.role,
  articles: data.articles,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

module.exports = {
  serialize,
  serializeCollection,
  serializeDetail,
};