import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import styles from './styles.css'
export default class Pokemon extends Component {
  constructor(props) {
    super(props)
  }

  renderWithQuery (pokemonId) {
    const getPokemonsQuery = gql`
    query getPokemonsQuery ($pokemonId :  String!) {
      pokemon(id:$pokemonId) {
        id
        name
        weight{
          minimum
          maximum
        }
        types
        weaknesses
        image
      }
    }
  `
    return(
      <Query query={getPokemonsQuery} variables={{pokemonId}} >
        {
          ({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            const pokemon = data.pokemon
            return (
              <div className={styles.pokemonContainer}>
                <img src={pokemon.image}></img>
                <div>
                  <h1> Name : {pokemon.name}</h1>
                  <h2> Class : {pokemon.types} </h2>
                  <h2> </h2>
                </div>
            </div>
            )
          }
        }
      </Query>
    )
  }

  render() {
    const { pokemon, pokemonId } = this.props
    return(
      <div className={styles.pokemonContainer} >
        {
          pokemonId ? this.renderWithQuery(pokemonId) : (
            <div className={styles.pokemonContainer}>
              <img src={pokemon.image}></img>
              <div>
                <h1> Name : {pokemon.name}</h1>
                <h2> Class : {pokemon.types} </h2>
                <h2> </h2>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}