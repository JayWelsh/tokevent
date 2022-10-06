export interface IEvent {
  name: string
  description: string
  slug: string
  startTimeUnix: number
  tokens: IToken[]
}

interface IToken {
  address: string
  network: 'mainnet'
  standard: 'ERC721'
  tokensPerTicket: number
}

export interface IHost {
  name: string
  events: IEvent[]
}

export interface ISlugToHost {
  [key: string]: IHost
}

const ExampleHost : IHost = {
  name: 'Example Host',
  events: [
    {
      name: 'Example Event',
      slug: 'example-event',
      description: 'An open source event taking place in the mountains over the weekend of halloween',
      startTimeUnix: 1664841600,
      tokens: [
        {
          address: '0x975d74900ef48F53Fa7d4F3550FA0C89f3B3c1Dc',
          network: 'mainnet',
          standard: 'ERC721',
          tokensPerTicket: 1,
        }
      ]
    }
  ]
}

const slugToHost : ISlugToHost = {
  'example-host': ExampleHost
}

export {
  slugToHost
}