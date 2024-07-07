## HNG Backend Stage 2

## Instructions
The instructions for this task is stored (INSTRUCTIONS.md)[here].

## Local setup
- Clone the repository
- Run the following to setup the database:
```shell
    psql -U your_username -d your_database_name -f ./src/db/setup.sql
```
- Copy the keys from `.env.example` to `.env` for production, and from `.env.dev` for development. Make sure you fill the values appropriately.
- Start the server with:
```shell
    npm run dev
```