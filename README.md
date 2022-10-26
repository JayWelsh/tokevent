# Tokevent.org

This is a platform made for token-gating physical events (e.g. using NFTs as tickets) and can also be used for doing simple auth for address holders without needing to make on-chain transactions (e.g. making sure you are communicating with the holder of the private key of a particular address).

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