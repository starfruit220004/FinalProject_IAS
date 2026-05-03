const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'], // shows DB errors in terminal
});

module.exports = prisma;