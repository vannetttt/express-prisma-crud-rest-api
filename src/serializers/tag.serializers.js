/**
 * Serializes a single tag object.
 * @param {object} tag - The tag data to serialize.
 * @param {number} tag.id - The ID of the tag.
 * @param {string} tag.title - The title of the tag.
 * @param {Array<object>} tag.articles - The articles associated with the tag.
 * @param {Date} tag.created_at - The creation date of the tag.
 * @param {Date} tag.updated_at - The last update date of the tag.
 * @returns {object} - The serialized tag object.
 */
const serialize = ({ id, title, articles, created_at, updated_at }) => ({
  id,
  title,
  articles,
  created_at,
  updated_at,
});

/**
 * Serializes a collection of tags.
 * @param {object} collection - The collection of tags to serialize.
 * @param {Array<object>} collection.data - The array of tag objects.
 * @returns {Array<object>} - The array of serialized tag objects.
 */
const serializeCollection = ({ data }) => data.map(serialize);

module.exports = {
  serialize,
  serializeCollection,
};