const { format } = require('date-fns');

/**
 * Formats a given date into 'yyyy-MM-dd p' format.
 * @param {Date|string|number} date - The date to format. Can be a Date object, a string, or a timestamp.
 * @returns {string} - The formatted date string.
 */
const formatDate = (date) => {
	const d = new Date(date);
	return format(d, 'yyyy-MM-dd p');
};

/**
 * Formats a given title by capitalizing the first letter and trimming any extra spaces.
 * @param {string} title - The title to format.
 * @returns {string} - The formatted title.
 */
const formatTitle = (title) => {
	return title.charAt(0).toUpperCase() + title.slice(1).trim();
};

module.exports = {
	formatDate,
	formatTitle,
};