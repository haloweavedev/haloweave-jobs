#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Apply database migrations
npx prisma migrate deploy

# Build the Next.js application
npx prisma generate && next build