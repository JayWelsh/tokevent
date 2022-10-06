https://user-images.githubusercontent.com/14224459/164458916-f8475fd0-efcf-4d7d-a322-572836837b8f.mp4

# Material UI Web3

Material UI Web3 is relatively barebones boilerplate for Ethereum DApps. This project makes use of primarily [Ethers](https://docs.ethers.io/v5/) and [useDapp](https://usedapp-docs.netlify.app/docs) to interface with the Ethereum blockchain, using [Material UI](https://mui.com/) (MUI) V5 for the user interface. [Redux](https://redux.js.org/) boilerplate is built-in. [Web3Modal](https://github.com/Web3Modal/web3modal) support has also been included.

## IPFS-ready

This repository has been constructed to be easily deployable to [IPFS](https://ipfs.io/), running a `yarn build` and uploading the build folder to IPFS will result in a ready-to-use IPFS deployment without needing to make any further adjustments (e.g. hash routing & package.json config), here is a [demo ipfs deployment](https://vagabond.mypinata.cloud/ipfs/QmeNxURjGqpHE7EZ83GGeQNv1Zcr3PMG3n2DYvT3sA8dvr/#/).

## Getting started

First off, it's important to rename `.env.example` to `.env` and add your Infura or Alchemy API key to this file (also remove the example entry that won't be used), this will enable your DApp to work in read-only mode (i.e. before a user connects their wallet provider).

Before using this in a live deployment, make sure to replace the favicon and logos located in the `public` folder.

## Scripts

### `yarn`

Installs required packages

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Runs a build to generate production-ready code which can also be easily deployed to IPFS (IPFS deployment optional).