# NOJS (NextJS Open Journal System)


## Running on local setup

First run the prisma DB locally
```bash
npx prisma dev --name "localDB" --detach

# To stop the DB from running in the background later on, use this commmand 
npx prisma dev stop localDB

```

Copy and Paste the value given into the .env
```bash
# example

DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"

SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51215/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"

```

Migrate the Database
```bash
# to prevent unexpected error run this before migration
npx prisma generate

# if there's no migrations file exist yet
npx prisma migrate dev --name init

# if migrations files already exist
npx prisma migrate dev
```

Run the Nextjs App

```bash
npm run dev
```