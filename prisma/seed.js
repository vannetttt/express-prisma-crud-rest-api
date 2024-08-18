const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	await prisma.user.create({
		data: {
			email: 'demo@gmail.com',
			username: 'demo',
			password: '$2b$10$0Zdt8drSsHj6wGuNHjWcaOlNJ3iy3E/hjei7UZMQfbOao.Ci7xy.e', // 12345678
			role: 'ADMIN',
		},
	});
}

main()
.catch((e) => {
	console.error(e);
	process.exit(1);
})
.finally(async () => {
	await prisma.$disconnect();
});
