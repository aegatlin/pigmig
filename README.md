# pigmig

Pigmig is a postgresql database migration tool with a minimal feature set.

## Install

```sh
npm install pigmig
```

## Usage

1. **Provide a database** via the `DATABASE_URL` environment variable. Pigmig will find it automatically by reading it from `process.env.DATABASE_URL`.

1. **Create migrations** and ensure their proper ordering. The easiest way to do this is by using the provided command line tool `pigmig.newmig`.

   ```sh
   npx pigmig.newmig src/db/migrations add_user_table
   ```

   This creates a `.sql` file in `src/db/migrations` that is prepended with a timestamp, e.g., `1606291679849.add_user_table.sql`

1. **Run migrations**. There are two ways to do this, via the cli or programmatically.

   - CLI: Run `pigmig.migrate`, passing in the path to your migrations directory.

      ```sh
      npx pigmig.migrate src/db/migrations
      ```

   - Programmatically: Include the following line near the top of your `server.[js|ts]` file or it's equivalent for your tech stack.

      ```typescript
      import pigmig from 'pigmig'
      ...
      await pigmig.migrate('src/db/migrations')
      ```

## Notes

Pigmig creates a `migrations` table if one does not already exist. It verifies the checksums of previously ran migrations. Each time it runs a new migration, it adds a row for it to the `migrations` table.

The philosophy behind `pigmig` is an "always up" / "no rollbacks" / "no down" migration strategy.
