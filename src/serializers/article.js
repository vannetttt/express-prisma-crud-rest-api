const { formatTitle } = require('../utils/helper');

/**
 * Serializes a single article object.
 * @param {object} data - The article data to serialize.
 * @param {number} data.id - The ID of the article.
 * @param {string} data.title - The title of the article.
 * @param {string} data.content - The content of the article.
 * @param {object} data.author - The author of the article.
 * @param {number} data.author.id - The ID of the author.
 * @param {string} data.author.username - The username of the author.
 * @param {Array<object>} data.tags - The tags associated with the article.
 * @param {object} data.tags.tag - The tag object.
 * @param {number} data.tags.tag.id - The ID of the tag.
 * @param {string} data.tags.tag.title - The title of the tag.
 * @param {Date|null} data.published_at - The publication date of the article.
 * @param {Date} data.created_at - The creation date of the article.
 * @param {Date} data.updated_at - The last update date of the article.
 * @returns {object} - The serialized article object.
 */
const serialize = (data) => ({
  id: data.id,
  title: formatTitle(data.title),
  content: data.content,
  author_id: data.author?.id,
  author: {
    id: data.author?.id,
    username: data.author?.username,
  },
  tags: data.tags?.map((tag) => ({
    id: tag.tag.id,
    title: tag.tag.title,
  })) || [],
  status: data.published_at ? 'PUBLISHED' : 'DRAFT',
  published_at: data.published_at,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

/**
 * Serializes a collection of articles.
 * @param {object} collection - The collection of articles to serialize.
 * @param {Array<object>} collection.data - The array of article objects.
 * @returns {Array<object>} - The array of serialized article objects.
 */
const serializeCollection = (collection) =>
  collection.data.map((article) => serialize(article));

/**
 * Serializes detailed information of a single article.
 * @param {object} data - The article data to serialize.
 * @param {number} data.id - The ID of the article.
 * @param {string} data.title - The title of the article.
 * @param {string} data.content - The content of the article.
 * @param {object} data.author - The author of the article.
 * @param {Array<object>} data.tags - The tags associated with the article.
 * @param {object} data.tags.tag - The tag object.
 * @param {number} data.tags.tag.id - The ID of the tag.
 * @param {string} data.tags.tag.title - The title of the tag.
 * @param {Date|null} data.published_at - The publication date of the article.
 * @param {Date} data.created_at - The creation date of the article.
 * @param {Date} data.updated_at - The last update date of the article.
 * @returns {object} - The serialized detailed article object.
 */
const serializeDetail = (data) => ({
  id: data.id,
  title: formatTitle(data.title),
  content: data.content,
  author: data.author,
  tags: data.tags?.map((tag) => tag.tag) || [],
  status: data.published_at ? 'published' : 'draft',
  published_at: data.published_at,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

module.exports = {
  serialize,
  serializeCollection,
  serializeDetail,
};