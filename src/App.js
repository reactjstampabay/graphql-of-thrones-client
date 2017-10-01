import React, { Component } from 'react';
import { graphql, gql, withApollo } from 'react-apollo';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    characterKilled: null
  };
  refresh = () => {
    const { refetch } = this.props.data;
    refetch();
  }

  componentDidMount() {
    const { client } = this.props;
    client.subscribe({
      query: gql`
      subscription someoneKilled($user_id: Int!) {
        characterKilled(user_id: $user_id) {
          user_id,
          first_name,
          last_name,
          message
        }
      }
      `,
      variables: {
        user_id: 1
      }
    })
    .subscribe({
      next (payload) {
        let {characterKilled} = payload;
        alert(characterKilled.message);
      }
    });
  }

  render() {
    const { users = [] } = this.props.data;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>
          {users.map((user, index) => (<li key={index}>{user.first_name}</li>))}
        </ul>
        <button onClick={this.refresh}>Refresh List</button>
      </div>
    );
  }
}

const usersQuery = gql`
query getUsers($id: [Int!]) {
  users(id: $id) {
    first_name
    last_name
  } 
}
`;

const AppWithQuery = graphql(usersQuery, {
  options: props => {
    return {
      variables: {
        id: props.id
      }
    }
  }
})(App);
export default withApollo(AppWithQuery);
