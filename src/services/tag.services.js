const prisma = require('../utils/db.js');

/**
 * Fetches a paginated list of tags based on the provided attributes.
 * @param {object} attributes - The attributes for fetching tags.
 * @param {number} [attributes.page=1] - The page number.
 * @param {number} [attributes.per_page=15] - The number of tags per page.
 * @param {string} [attributes.search=null] - The search term for filtering tags by title.
 * @returns {object} - The paginated list of tags and metadata.
 */
const index = async (attributes) => {
	let { page = 1, per_page = 15, search = null } = attributes;

	const take = Number(per_page);
	const skip = (Number(page) - 1) * take;

	const whereClause = {};

	if (search) {
		whereClause.title = {
			contains: search,
			mode: 'insensitive',
		};
	}

	const result = await prisma.tag.findMany({
		where: whereClause,
		take: take,
		skip: skip,
		orderBy: {
			created_at: 'desc',
		},
	});

	const total = await prisma.tag.count({
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
 * Creates a new tag with the provided attributes.
 * @param {object} attributes - The attributes for the new tag.
 * @param {string} attributes.title - The title of the tag.
 * @returns {object} - The created tag.
 */
const store = async (attributes) => {
	const { title } = attributes;

	return prisma.tag.create({
		data: {
			title,
		},
	});
};

/**
 * Updates an existing tag by ID with the provided attributes.
 * @param {number} id - The ID of the tag to update.
 * @param {object} attributes - The attributes to update.
 * @param {string} attributes.title - The new title of the tag.
 * @returns {object} - The updated tag.
 */
const update = async (id, attributes) => {
	const { title } = attributes;
	return prisma.tag.update({
		where: {
			id: parseInt(id),
		},
		data: { title },
	});
};

/**
 * Fetches a single tag by ID.
 * @param {number} id - The ID of the tag to fetch.
 * @returns {object|null} - The tag or null if not found.
 */
const show = async (id) => {
	return prisma.tag.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			articles: {
				include: {
					article: true,
				},
			},
		},
	});
};

/**
 * Deletes a tag by ID.
 * @param {number} id - The ID of the tag to delete.
 * @returns {object|boolean} - The deleted tag or false if the tag is not found or cannot be deleted.
 */
const destroy = async (id) => {
	const result = await prisma.tag.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!result) {
		throw new Error('Tag not found');
	}

	const articles = await prisma.article.findMany({
		where: {
			tags: {
				some: {
					tag_id: Number(id),
				},
			},
		},
	});

	if (articles.length > 0) {
		throw new Error('Cannot delete tag with associated articles');
	}

	return prisma.tag.delete({
		where: {
			id: Number(id),
		},
	});
};

/**
 * Fetches a list of tags for select options.
 * @returns {Array<object>} - The list of tags with id and title.
 */
const selectOptions = async () => {
	return prisma.tag.findMany({
		select: {
			id: true,
			title: true,
		},
	});
};

module.exports = {
	index,
	store,
	update,
	show,
	destroy,
	selectOptions,
};