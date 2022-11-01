export interface IEvent {
  name: string
  description: string
  slug: string
  startTimeUnix: number
  tokens?: IToken[]
  image: string
  onlyAddressVerification?: boolean
}

export interface IToken {
  address: string
  network: 'mainnet'
  standard: 'ERC721'
  tokensPerTicket: number
}

export interface IHost {
  name: string
  description?: string
  events: IEvent[]
  image: string
  hidden?: boolean
}

export interface ISlugToHost {
  [key: string]: IHost
}

// const ExampleHost : IHost = {
//   name: 'Example Host',
//   events: [
//     {
//       name: 'Example Event',
//       slug: 'example-event',
//       description: 'An open source event taking place in the mountains over the weekend of halloween',
//       startTimeUnix: 1664841600,
//       tokens: [
//         {
//           address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
//           network: 'mainnet',
//           standard: 'ERC721',
//           tokensPerTicket: 1,
//         }
//       ]
//     },
//     {
//       name: 'Example Event 2',
//       slug: 'example-event-2',
//       description: 'An open source event taking place in the mountains over the weekend of halloween',
//       startTimeUnix: 1664841600,
//     }
//   ]
// }

const DemoHost : IHost = {
  name: 'demo',
  description: 'a demo host to preview the functionality of tokevent.org',
  image: 'ipfs://QmW8imDcfrJE74ZGuJFtzHcNapLZc8nbn6wb98Eku1sonq',
  hidden: true,
  events: [
    {
      name: 'demo event',
      slug: 'demo-event',
      description: 'a demo event to preview tokevent.org functionality',
      startTimeUnix: 1664851700,
      image: 'ipfs://QmW8imDcfrJE74ZGuJFtzHcNapLZc8nbn6wb98Eku1sonq',
      tokens: [
        {
          address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', // ENS (https://opensea.io/collection/ens)
          network: 'mainnet',
          standard: 'ERC721',
          tokensPerTicket: 1,
        }
      ]
    },
  ]
}

const PropyHost : IHost = {
  name: 'Propy',
  description: 'On-chain Real Estate',
  image: 'ipfs://QmYHwLzZ5LBz8yuPzCKrgo6tj5Vjk4SU1cSTA7KyyCHZYp',
  events: [
    {
      name: 'Web3 & Real Estate Summit 2022',
      slug: 'web3-real-estate-summit-2022',
      description: 'Miami Beach Convention Center',
      startTimeUnix: 1664841600,
      image: 'ipfs://QmZmwmKgBuc43B2jZuuUmFok4BdvmL3AZsJZ6CBxPujqda',
      tokens: [
        {
          address: '0xb5c4910335d373eb26febb30b8f1d7416179a4ec',
          network: 'mainnet',
          standard: 'ERC721',
          tokensPerTicket: 1,
        }
      ]
    },
  ]
}

const WgmisHost : IHost = {
  name: 'wgmis',
  description: 'frenly cc0 froggos by desultor',
  image: 'ipfs://QmYBPirsvyL9fG3gt33cDzjh5HCSnf4x8fhihHjpccDRKh',
  events: [
    {
      name: 'a hard frens night raffle',
      slug: 'a-hard-frens-night-raffle',
      description: 'Raffle for a physical painting by Noah Verrier',
      startTimeUnix: 1664841600,
      image: 'ipfs://QmadUL9BWRyoAC9mRWa4f7LtLG2wt2bwco8RtQp7AYhrqs',
      onlyAddressVerification: true
    },
  ]
}

const slugToHost : ISlugToHost = {
  'demo': DemoHost,
  'propy': PropyHost,
  'wgmis': WgmisHost,
}

export {
  slugToHost
}