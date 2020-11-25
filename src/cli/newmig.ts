#! /usr/bin/env node

console.log('Pigmig: Creating new migration file...')

import fs from 'fs'
import path from 'path'

const dirPath = process.argv[2]
const fileNamePart = process.argv[3]

if (!dirPath || !fileNamePart) {
  console.log(
    'Pigmig: Error: Please provide a migration directory and a desired file name.'
  )
  console.log(
    'Pigmig: Example: npx pigmig.newmig src/db/migrations add_user_table'
  )
  console.log('Pigmig: Exiting early. No new migration file has been created.')
  process.exit()
}

const timestamp = Date.now()
const fileName = `${timestamp}.${fileNamePart}.sql`
const filePath = path.resolve(dirPath, fileName)

fs.writeFileSync(filePath, '')

console.log(`Pigmig: New migration file successfully created: ${filePath}`)
