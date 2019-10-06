// import { expect } from 'chai'
// import { filterMigs } from '.'
// import { IMigration } from './migration.interface'

// const fakes: { [key: string]: IMigration } = {
//   mig1: {
//     fileName: '001.mig1.sql',
//     sql: 'CREATE TABLE mig1(id serial);',
//     checksum: 'asdf1234'
//   },
//   mig2: {
//     fileName: '002.mig2.sql',
//     sql: 'CREATE TABLE mig2(id serial);',
//     checksum: 'zxcv5678'
//   },
//   mig3: {
//     fileName: '003.mig3.sql',
//     sql: 'CREATE TABLE mig3(id serial);',
//     checksum: 'qwer9101'
//   }
// }

// describe('filterMigs', () => {
//   it('filters out old migrations', () => {
//     const allMigs = [fakes.mig1, fakes.mig2, fakes.mig3]
//     const oldMigs = [fakes.mig1, fakes.mig2]
    
//     expect(filterMigs(allMigs, oldMigs)).to.eql([fakes.mig3])
//   })
// })


