import DataObject from '../dataFormat'

export const info: DataObject = {
  title: 'TEST',
  description: 'TEST',
  tags: ['TEST', 'TEST', 'TEST'],
  usage: [{ system: 'TEST', ref: 'TEST' }],
  authorization: { owner: 'TEST' }
}

export const headers = {
  Accept: 'application/json',
  'x-onbehalfof': 'USERTEST',
  'system-id': 'SYSTEST',
  'kall-id': 'jkdfhsd89ify7348efkjnhdskbgkTEST'
}

export const testobj = {
  bucket: 'TESTINGTESTINGTESTING',
  filename: 'TESTINGTESTINGTESTING',
  key: 'TESTINGTESTINGTESTING',
  metadata: {
    description: 'TESTINGTESTINGTESTING',
    events: [
      {
        description: 'TESTINGTESTINGTESTING',
        endTime: 5,
        id: 'TESTINGTESTINGTESTING',
        startTime: 6,
        svgBase64: 'TESTINGTESTINGTESTING',
        title: 'TESTINGTESTINGTESTING'
      }
    ],
    location: {
      lat: 7,
      lon: 66
    },
    recordedTime: '2019-12-TESTINGTESTINGTESTING:1dfsdsd4:56.875Z',
    title: 'TESTINGTESTINGTESTING'
  }
}
