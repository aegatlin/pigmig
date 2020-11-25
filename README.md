# pigmig

Pigmig is a postgresql database migration tool with a minimal feature set.

## Install

```sh
npm install pigmig
```

## Usage

1. Set a `DATABASE_URL` environment variable. Pigmig will find it automatically by reading it from `process.env.DATABASE_URL`.

1. Create migrations and ensuring their proper ordering. The easiest way to do this is by using the provided command line tool `pigmig.newmig`.

   ```sh
   npx pigmig.newmig src/db/migrations add_user_table
   ```

   This creates a `.sql` file in `src/db/migrations` that is prepended with a timestamp, e.g., `1606291679849.add_user_table.sql`

1. Run the migrations. Place the following line near the top of your `server.[js|ts]` file, or it's equivalent for your tech stack.

   ```typescript
   import pigmig from 'pigmig'
   ...
   await pigmig.migrate('src/db/migrations')
   ```

## Notes

Pigmig creates a `migrations` table if one does not already exist. It verifies the checksums of previously ran migrations. Each time it runs a new migration, it adds a row for it to the `migrations table.

The philosophy behind `pigmig` is an "always up" / "no rollbacks" / "no down" migration strategy. This allows for a few simplifications, such as raw `.sql` files as migration scripts. It also simplifies the developers job. They don't have to worry about how to write a down script after data has been written with it. They can also focus on writing very small, very clean migrations along with code changes that allow for smooth data transitions. The downside to this strategy is that you will need to think quite carefully about your migrations, but since you should be anyways, maybe it's all okay.  Or, another way of saying it, "no rollbacks". I am looking for good external resources to share here to back up this perspective, but I've lost track of some of the good reads on the subject that persuaded me years ago.
