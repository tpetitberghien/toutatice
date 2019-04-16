const MockDate = require('mockdate')
const transpileToCozy = require('./transpileToCozy')

const MOCKED_DATE = '2019-03-05T09:09:00.115Z'
const MOCK_CONTACT_ACCOUNT_ID = '123-abc'
const KONNECTOR_NAME = 'konnector-toutatice'
const DOCTYPE = 'io.cozy.contacts'

describe('Transpile to cozy', () => {
  beforeAll(() => {
    MockDate.set(MOCKED_DATE)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should transpile students', () => {
    const source = {
      uuid: '1458-1523-1236-123',
      firstname: 'Nicolas',
      lastname: 'Blin',
      title: 'ele',
      cloud_url: 'nblin3.mytoutatice.cloud'
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result).toEqual({
      _type: DOCTYPE,
      name: {
        familyName: 'Blin',
        givenName: 'Nicolas'
      },
      cozy: [
        {
          url: 'https://nblin3.mytoutatice.cloud',
          label: null,
          primary: true
        }
      ],
      jobTitle: 'Élève',
      cozyMetadata: {
        sync: {
          [MOCK_CONTACT_ACCOUNT_ID]: {
            contactsAccountsId: MOCK_CONTACT_ACCOUNT_ID,
            id: '1458-1523-1236-123',
            konnector: KONNECTOR_NAME,
            lastSync: MOCKED_DATE,
            remoteRev: null
          }
        }
      }
    })
  })

  it('should transpile teachers', () => {
    const source = {
      uuid: '1452-1547-2365-7894',
      firstname: 'Sophie',
      lastname: 'Schaal',
      title: 'ens',
      cloud_url: 'sschaal14.mytoutatice.cloud'
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result).toEqual({
      _type: DOCTYPE,
      name: {
        familyName: 'Schaal',
        givenName: 'Sophie'
      },
      cozy: [
        {
          url: 'https://sschaal14.mytoutatice.cloud',
          label: null,
          primary: true
        }
      ],
      jobTitle: 'Enseignant',
      cozyMetadata: {
        sync: {
          [MOCK_CONTACT_ACCOUNT_ID]: {
            contactsAccountsId: MOCK_CONTACT_ACCOUNT_ID,
            id: '1452-1547-2365-7894',
            konnector: KONNECTOR_NAME,
            lastSync: MOCKED_DATE,
            remoteRev: null
          }
        }
      }
    })
  })

  it('should transpile unknown job titles', () => {
    const source = {
      uuid: '8726-1029-1189-8627',
      firstname: 'Rufus',
      lastname: 'Roderson',
      title: 'random',
      cloud_url: 'rroderson120.mytoutatice.cloud'
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result.jobTitle).toEqual('random')
  })

  it('should handle empty job titles', () => {
    const source = {
      uuid: '8726-1029-1189-8627',
      firstname: 'Rufus',
      lastname: 'Roderson',
      title: null,
      cloud_url: 'rroderson120.mytoutatice.cloud'
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result.jobTitle).toEqual(undefined)
  })

  it('should handle empty cozy urls', () => {
    const source = {
      uuid: '8726-1029-1189-8627',
      firstname: 'Rufus',
      lastname: 'Roderson',
      title: 'ele',
      cloud_url: ''
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result.cozy).toEqual([])
  })

  it('should handle missing fields', () => {
    const source = {
      uuid: '1728-0091-6274-1839'
      // no other fields
    }
    const result = transpileToCozy(source, MOCK_CONTACT_ACCOUNT_ID)
    expect(result).toEqual({
      _type: DOCTYPE,
      jobTitle: undefined,
      name: {
        familyName: undefined,
        givenName: undefined
      },
      cozy: [],
      cozyMetadata: {
        sync: {
          [MOCK_CONTACT_ACCOUNT_ID]: {
            contactsAccountsId: MOCK_CONTACT_ACCOUNT_ID,
            id: '1728-0091-6274-1839',
            konnector: KONNECTOR_NAME,
            lastSync: MOCKED_DATE,
            remoteRev: null
          }
        }
      }
    })
  })
})