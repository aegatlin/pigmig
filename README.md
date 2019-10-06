# pigmig

Pigmig is a simple postgresql database migration library.

## Set up

1. Set `process.env.DATABASE_URL`
1. Do not have a `migrations` table already

## Usage

```typescript
import { resolve } from 'path' // path is a builtin node.js utility
import { migrate } from 'pigmig'

const migDir = resolve('src/db/migrations')
migrate(migDir)
```
