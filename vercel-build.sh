#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Apply database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Build the Next.js application
next build