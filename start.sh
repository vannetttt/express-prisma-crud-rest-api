#!/bin/sh

# Run prisma generate to ensure the client is up-to-date
npx prisma generate

# Start the application with nodemon
npx nodemon index.js
