#!/usr/bin/env sh

cd /next

# copy .env file if not exists
[ ! -f .env ] && [ -f .env.example ] && cp .env.example .env
cp .env .env.temp
dos2unix .env.temp
cat .env.temp > .env
rm .env.temp

source .env

# Ensure DB is available before running Prisma commands
./wait-for-db.sh caelumgpt_db 3307

# Debug: Show current directory and contents
echo "Current directory: $(pwd)"
echo "Listing /next directory:"
ls -la
echo "Listing /next/prisma directory:"
ls -la prisma/

# Verify prisma schema exists
if [ ! -f ./prisma/schema.prisma ]; then
    echo "Error: Prisma schema not found at ./prisma/schema.prisma"
    exit 1
fi

echo "Found Prisma schema, contents:"
cat ./prisma/schema.prisma

# Regenerate Prisma client with current environment
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy
npx prisma db push

# run cmd
exec "$@"
