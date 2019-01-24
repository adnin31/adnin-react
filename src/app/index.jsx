import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'

import styles from './style.css'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import Pokemons from './Pokemons'
import Pokemon from './Pokemon'

const client = new ApolloClient({
  uri: 'http://localhost:5050/'
})


export default class App extends Component {
  render () {
    const pokemonDetail = ({match}) => (
      <Pokemon pokemonId={match.params.id}/>
    )

    return(
      <ApolloProvider client={client}>
        <Router>
          <div className={styles.pokemonContainer}>
            <Switch>
              <Route exact path="/" component={Pokemons} />
              <Route path='/:id' component={pokemonDetail} />
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    )
  }
}
