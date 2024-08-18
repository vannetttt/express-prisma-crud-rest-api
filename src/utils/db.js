const { PrismaClient } = require('@prisma/client');

/**
 * Singleton function to create and manage a single instance of PrismaClient.
 * @returns {PrismaClient} - The singleton instance of PrismaClient.
 */
const prismaClientSingleton = (() => {
	let instance = null;
	return () => {
		if (!instance) {
			instance = new PrismaClient();
		}
		return instance;
	};
})();

const globalForPrisma = globalThis;

/**
 * The PrismaClient instance used throughout the application.
 * If in a non-production environment, the instance is stored globally to prevent multiple instances.
 * @type {PrismaClient}
 */
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;