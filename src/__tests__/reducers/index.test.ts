import { findMatchingEntities, filterEntities } from '../../reducers'

describe('findMatchingEntities test', () => {
  const datasets = require('../../../docker/db/data/datasets.json')
  const matchingDatasets = findMatchingEntities('searchTerm', datasets)
  it('returns an array the same length of input array', () => {
    expect(matchingDatasets.length).toStrictEqual(datasets.length)
  })
  matchingDatasets.forEach(d => {
    it(`each item in returned array has a field called 'matches'`, () => {
      expect(d).toHaveProperty('matches')
    })
  })
})

describe('filterEntitites test', () => {
  const datasets = require('../../../docker/db/data/datasets.json')
  const matchingDatasets = filterEntities('sourceName', 'something', datasets)
  it('returns an array the same length of input array', () => {
    expect(matchingDatasets.length).toStrictEqual(datasets.length)
  })
  matchingDatasets.forEach(d => {
    it(`each item in returned array has a field called 'matches'`, () => {
      expect(d).toHaveProperty('matches')
    })
  })
  it('returns an array with at least one match if we feed it something that matches', () => {
    const matchingDatasets = filterEntities('sourceName', datasets[0].sourceName, datasets)
    expect(matchingDatasets.filter(d => d.matches).length).toBeGreaterThan(0)
  })
})
