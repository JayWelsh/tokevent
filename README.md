# tokevent.org (beta)

This is a platform made for token-gating physical events (e.g. using NFTs as tickets) and can also be used for doing simple auth for address holders without needing to make on-chain transactions (e.g. making sure you are communicating relatively directly with the holder of a private key of a particular address), this platform is also constructed in a way to minimize any reliance on centralized infrastructure. It is easy to self-host & does not rely on a centralized API.

## Acknowledgements

The construction of this platform was made possible by an independent infrastructure grant from https://seen.haus - thank you for supporting independent infrastructure and enabling the development of this public good for the NFT space.


## IPFS-ready

If you intend to deploy this to IPFS, swap the `BrowserRouter` in `/src/components/App.tsx` for `HashRouter` and set the `start_url` in `/manifest.json` to `./`.

## Getting started

First off, it's important to rename `.env.example` to `.env` and add your Infura or Alchemy API key to this file (also remove the example entry that won't be used), this will enable your DApp to work in read-only mode (i.e. before a user connects their wallet provider).

## Scripts

### `yarn`

Installs required packages

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Runs a build to generate production-ready code, if you intend to deploy this to IPFS, swap the `BrowserRouter` in `/src/components/App.tsx` for `HashRouter` and set the `start_url` in `/manifest.json` to `./`.