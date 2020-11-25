#! /usr/bin/env node

import pigmig from '../code/pigmig'

const dirPath = process.argv[2]

if (!dirPath) {
  console.log('Pigmig: Error: Please provide your migrations directory path.')
  console.log('Pigmig: Example: npx pigmig.migrate src/db/migrations')
  console.log('Pigmig: Exiting early. No migrations were ran.')
  process.exit()
}

pigmig.migrate(dirPath)
