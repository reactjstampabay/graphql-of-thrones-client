import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';
import registerServiceWorker from './registerServiceWorker';

// Apollo
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_API_ROOT
});

// Create WebSocket client
const wsClient = new SubscriptionClient(`ws://localhost:5000/graphql`, {
  reconnect: true,
  connectionParams: {
      // Pass any arguments you want for initialization
  }
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({networkInterface: networkInterfaceWithSubscriptions});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App id={[1,2,3]} />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
