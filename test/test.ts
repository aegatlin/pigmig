import { expect } from 'chai'
import { getNewMigs, Migration, verifyChecksums } from '../src/code/pigmig'

describe('getNewMigs', () => {
  it('returns an empty array for empty migs', () => {
    expect(getNewMigs([], [])).to.eql([])
  })

  it('returns an empty array when there are no new migs', () => {
    const dbMigs: Migration[] = [{ fileName: 'f', sql: 's', checksum: 'c' }]
    const fileMigs: Migration[] = [{ fileName: 'f', sql: 's', checksum: 'c' }]
    const actual: Migration[] = getNewMigs(dbMigs, fileMigs)

    expect(actual).to.eql([])
  })

  it('returns only the fileMigs NOT in the dbMigs', () => {
    const dbMigs: Migration[] = [{ fileName: 'f', sql: 's', checksum: 'c' }]
    const fileMigs: Migration[] = [
      { fileName: 'f', sql: 's', checksum: 'c' },
      { fileName: 'f2', sql: 's2', checksum: 'c2' },
    ]
    const actual: Migration[] = getNewMigs(dbMigs, fileMigs)

    expect(actual).to.eql([{ fileName: 'f2', sql: 's2', checksum: 'c2' }])
  })
})

describe('verifyChecksums', () => {
  it('throws when a dbMig checksum does NOT have a matching fileMig checksum', () => {
    const dbMigs: Migration[] = [{fileName: 'a', sql: 'b', checksum: 'c'}]
    const fileMigs: Migration[] = [{fileName: 'a', sql: 'b', checksum: 'd'}]

    expect(() => verifyChecksums(dbMigs, fileMigs)).to.throw('Checksum verification failed for a.')
  })

  it('returns undefined when all checksums have been verified', () => {
    const dbMigs: Migration[] = [{fileName: 'a', sql: 'b', checksum: 'c'}]
    const fileMigs: Migration[] = [{fileName: 'a', sql: 'b', checksum: 'c'}]
    const actual = verifyChecksums(dbMigs, fileMigs)

    expect(actual).to.equal(undefined)
  })
})
