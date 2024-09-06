const prisma = require('../utils/db.js');
const byc = require('bcrypt');

/**
 * Fetches a paginated list of users based on the provided attributes.
 * @param {object} attributes - The attributes for fetching users.
 * @param {number} attributes.page - The page number.
 * @param {number} attributes.per_page - The number of users per page.
 * @param {string} [attributes.search] - The search term for filtering users by username.
 * @returns {object} - The paginated list of users and metadata.
 */
const index = async (attributes) => {
	let { page = 1, per_page = 15, search = null } = attributes;

	const take = Number(per_page);
	const skip = (Number(page) - 1) * take;
	const whereClause = {};

	if (search) {
		whereClause.username = {
			contains: search,
			mode: 'insensitive',
		};
	}

	whereClause.role = {
		not: 'ADMIN',
	};

	const result = await prisma.user.findMany({
		where: whereClause,
		take: take,
		skip: skip,
		include: {
			_count: {
				select: { articles: true },
			},
		},
		orderBy: {
			created_at: 'desc',
		},
	});

	const total = await prisma.user.count({
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
 * Creates a new user with the provided attributes.
 * @param {object} attributes - The attributes for the new user.
 * @param {string} attributes.username - The username of the new user.
 * @param {string} attributes.email - The email of the new user.
 * @param {string} attributes.role - The role of the new user.
 * @param {string} attributes.password - The password of the new user.
 * @returns {object} - The created user.
 */
const store = async (attributes) => {
	const { username, email, role, password } = attributes;

	const hashedPassword = await byc.hash(
		password,
		Number(process.env.BYCRYPT_SALT_ROUNDS),
	);

	return prisma.user.create({
		data: {
			username,
			email,
			role,
			password: hashedPassword,
		},
	});
};

/**
 * Updates an existing user by ID with the provided attributes.
 * @param {number} id - The ID of the user to update.
 * @param {object} attributes - The attributes to update.
 * @param {string} [attributes.username] - The new username.
 * @param {string} [attributes.email] - The new email.
 * @param {string} [attributes.role] - The new role.
 * @param {string} [attributes.password] - The new password.
 * @returns {object|boolean} - The updated user or false if the user is not found.
 */
const update = async (id, attributes) => {
	const user = await prisma.user.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	if (!user) {
		return false;
	} else {
		const { username, email, role, password } = attributes;

		const hashedPassword = password
			? await byc.hash(password, Number(process.env.BYCRYPT_SALT_ROUNDS))
			: user.password;

		return prisma.user.update({
			where: {
				id: parseInt(id),
			},
			data: {
				username: username ? username : user.username,
				email: email ? email : user.email,
				role: role ? role : user.role,
				password: hashedPassword,
			},
		});
	}
};

/**
 * Fetches a single user by ID.
 * @param {number} id - The ID of the user to fetch.
 * @returns {object|null} - The user or null if not found.
 */
const show = async (id) => {
	return prisma.user.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			articles: true,
		},
	});
};

/**
 * Deletes a user by ID and related records.
 * @param {number} id - The ID of the user to delete.
 * @returns {object} - The result of the deletion operation.
 * @throws {Error} - Throws an error if the user is not found or cannot be deleted.
 */
const destroy = async (id) => {
	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	// Delete related records
	await prisma.article.deleteMany({
		where: {
			userId: Number(id),
		},
	});

	// Delete the user
	const result = await prisma.user.delete({
		where: {
			id: Number(id),
		},
	});

	if (!result) {
		throw new Error('Failed to delete user');
	}

	return result;
};

/**
 * Fetches select options for authors.
 * @returns {Array} - The list of authors with their IDs and usernames.
 */
const authorSelectOptions = async () => {
	return prisma.user.findMany({
		where: {
			role: 'AUTHOR',
		},
		select: {
			id: true,
			username: true,
		},
	});
};

module.exports = {
	index,
	store,
	update,
	show,
	destroy,
	authorSelectOptions,
};