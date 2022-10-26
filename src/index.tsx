import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ChainId, DAppProvider } from '@usedapp/core'

import './styles/index.scss';
import AppContainer from './containers/AppContainer';
import reportWebVitals from './reportWebVitals';
import store from './state';

const mainnetReadOnlyUrl = () => {
  if(process.env.REACT_APP_INFURA_RPC_URL) {
    return `${process.env.REACT_APP_INFURA_RPC_URL}`;
  } else if(process.env.REACT_APP_ALCHEMY_RPC_URL) {
    return `${process.env.REACT_APP_ALCHEMY_RPC_URL}`;
  }
  return '';
}

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: mainnetReadOnlyUrl(),
  },
  multicallVersion: 1 as const,
  autoConnect: false,
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DAppProvider config={config}>
        <AppContainer />
      </DAppProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();