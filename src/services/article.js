const prisma = require('../utils/db.js');

/**
 * Fetches a paginated list of articles based on the provided attributes.
 * @param {object} attributes - The attributes for fetching articles.
 * @param {object} attributes.query - The query parameters.
 * @param {number} attributes.query.page - The page number.
 * @param {number} attributes.query.per_page - The number of articles per page.
 * @param {string} [attributes.query.search] - The search term for filtering articles by title or content.
 * @param {string} [attributes.query.status] - The status of the articles (e.g., 'DRAFT').
 * @param {string} [attributes.query.tag] - The tag ID for filtering articles.
 * @param {string} [attributes.query.author] - The author ID for filtering articles.
 * @param {object} attributes.user - The user object.
 * @param {string} attributes.user.role - The role of the user.
 * @param {number} attributes.user.id - The ID of the user.
 * @returns {object} - The paginated list of articles and metadata.
 */
const index = async (attributes) => {
	let {
		page = 1,
		per_page = 15,
		search,
		status,
		tag,
		author,
	} = attributes.query;

	let take = Number(per_page);
	let skip = (Number(page) - 1) * take;
	let whereClause = {};

	const user = attributes.user;
	const userRole = user.role;

	if (userRole !== 'ADMIN') {
		whereClause.author_id = user.id;
	}

	if (author && author !== '' && author !== 'undefined') {
		whereClause.author_id = Number(author);
	}

	if (search && search !== '' && search !== 'undefined') {
		whereClause.OR = [
			{
				title: {
					contains: search,
					mode: 'insensitive',
				},
			},
			{
				content: {
					contains: search,
					mode: 'insensitive',
				},
			},
		];
	}

	if (status && status !== 'undefined') {
		if (status === 'DRAFT') {
			whereClause.published_at = null;
		} else {
			whereClause.published_at = {
				not: null,
			};
		}
	}

	if (tag && tag !== '' && tag !== 'undefined') {
		whereClause.tags = {
			some: {
				tag_id: Number(tag),
			},
		};
	}

	const result = await prisma.article.findMany({
		where: whereClause,
		take: take,
		skip: skip,
		orderBy: {
			created_at: 'desc',
		},
		include: {
			author: true,
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});

	const total = await prisma.article.count({
		where: whereClause,
	});

	return {
		data: result,
		meta: {
			current_page: Number(page),
			last_page: Math.ceil(total / take),
			per_page: take,
			total: total,
		},
	};
};

/**
 * Fetches a single article by ID.
 * @param {number} id - The ID of the article to fetch.
 * @returns {object|null} - The article or null if not found.
 */
const show = async (id) => {
	return prisma.article.findUnique({
		where: {
			id: Number(id),
		},
		include: {
			author: true,
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});
};

/**
 * Creates a new article with the provided data.
 * @param {object} data - The data for the new article.
 * @param {string} data.title - The title of the article.
 * @param {string} data.content - The content of the article.
 * @param {Array<number>} data.tags - The tags associated with the article.
 * @param {string} [data.published_at] - The publication date of the article.
 * @param {object} user - The user object.
 * @param {string} user.role - The role of the user.
 * @param {number} user.id - The ID of the user.
 * @returns {object} - The created article.
 */
const store = async (data, user) => {
	let { title, content, tags, published_at, author_id } = data;

	if (user.role !== 'ADMIN') {
		author_id = user.id; // self assign
	}

	return prisma.article.create({
		data: {
			title,
			content,
			published_at: published_at ? new Date(published_at) : null,
			author: {
				connect: {
					id: author_id,
				},
			},
			tags: {
				create: tags.map((tagId) => ({
					tag: {
						connect: {
							id: Number(tagId),
						},
					},
				})),
			},
		},
		include: {
			author: true,
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});
};

/**
 * Updates an existing article by ID with the provided data.
 * @param {number} id - The ID of the article to update.
 * @param {object} data - The data to update.
 * @param {string} [data.title] - The new title.
 * @param {string} [data.content] - The new content.
 * @param {Array<number>} [data.tags] - The new tags.
 * @param {string} [data.published_at] - The new publication date.
 * @param {object} user - The user object.
 * @param {string} user.role - The role of the user.
 * @param {number} user.id - The ID of the user.
 * @returns {object|boolean} - The updated article or false if the article is not found.
 */
const update = async (id, data, user) => {
	let { title, content, tags, published_at, author_id } = data;

	const articleId = Number(id);
	const article = await prisma.article.findUnique({
		where: {
			id: articleId,
		},
	});

	if (!article) {
		return false;
	}

	if (user.role !== 'ADMIN') {
		author_id = user.id; // self assign
	}

	return prisma.article.update({
		where: {
			id: articleId,
		},
		data: {
			title,
			content,
			published_at: published_at ? new Date(published_at) : null,
			author: {
				connect: {
					id: author_id,
				},
			},
			tags: {
				deleteMany: {},
				create: tags.map((tagId) => ({
					tag: {
						connect: {
							id: Number(tagId),
						},
					},
				})),
			},
		},
		include: {
			author: true,
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});
};

/**
 * Deletes an article by ID.
 * @param {number} id - The ID of the article to delete.
 * @returns {object|boolean} - The deleted article or false if the article is not found.
 */
const destroy = async (id) => {
	const articleId = Number(id);
	const article = await prisma.article.findUnique({
		where: { id: articleId },
	});

	if (!article) {
		return false;
	}

	// delete all tags
	await prisma.article.update({
		where: { id: articleId },
		data: {
			tags: {
				deleteMany: {},
			},
		},
	});

	return prisma.article.delete({
		where: { id: articleId },
	});
};

/**
 * Toggles the publish status of an article by ID.
 * @param {number} id - The ID of the article to toggle.
 * @param {object} data - The data for toggling the publish status.
 * @param {boolean} data.is_published - The new publish status.
 * @returns {object|boolean} - The updated article or false if the article is not found.
 */
const togglePublish = async (id, data) => {
	const articleId = Number(id);
	const article = await prisma.article.findUnique({
		where: { id: articleId },
	});

	if (!article) {
		return false;
	}

	const isPublished = Boolean(data.is_published);
	const published_at = isPublished ? new Date() : null;

	return prisma.article.update({
		where: { id: articleId },
		data: {
			published_at,
		},
	});
};

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
	togglePublish,
};