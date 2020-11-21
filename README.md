# pigmig

Pigmig is a postgresql database migration tool. It has a minimal feature set.

1. Pigmig creates a migrations table if one does not already exist.
1. Pigmig verifies the checksums of previously ran migrations, throwing an error and exiting on failure.
1. Pigmig runs new migrations, adding them to the migrations table on success.

## Your responsibilities

1. Set `process.env.DATABASE_URL`
1. Store (only) `.sql` scripts in a migrations folder
   - Ensure they will be ordered correctly by the filesystem, e.g., `001.setup.sql`, `002.other.sql`, ...
1. Do not have a `migrations` table

## Usage

```typescript
import { resolve } from 'path'
import { migrate } from 'pigmig'

await migrate(resolve('src/db/migrations'))
```
