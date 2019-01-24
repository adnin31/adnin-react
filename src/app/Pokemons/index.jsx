import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { BrowserRouter as Router, Route, Link , Switch, Redirect, withRouter} from "react-router-dom";

import styles from './styles.css'
import Pokemon from '../Pokemon'

class PokemonList extends Component {
  constructor(props){
    super(props)

    this.state = {
      pokemonId: '',
      redirect: false
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleOnScroll);
  }

  handleOnScroll = () => {
    var scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    var scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    var clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      this.props.onLoadMore();
    }
  };

  handleListClick = (pokemonId) => {
    this.setState({
      pokemonId: pokemonId,
      redirect: true
    })
  }

  render () {
    const { entries , loading } = this.props
    const { redirect, pokemonId } = this.state

    const pokemons = entries
    if (loading) return <p>Loading...</p>;
    if (redirect) return <Redirect push to={`/${pokemonId}`} />
    return (
      <div>
        {
          pokemons.map((pokemon, key) => (
            <div onClick={() => this.handleListClick(pokemon.id)} key={key}>
              <Pokemon pokemon={pokemon} />
            </div>
          ))
        }
      </div>
    )
  }

}
withRouter(PokemonList)
export default class Pokemons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pokemonList: [],
      pokemonShow: 10,
      pageStart: 0,
    }
  }

  render() {
    const getPokemonsQuery = gql`
      query getPokemonsQuery ($pokemonShow: Int!) {
        pokemons(first:$pokemonShow) {
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
    const { pageStart, pokemonShow, pokemonList } = this.state

    return (
      <Query query={getPokemonsQuery} variables={{pokemonShow}}>
        {
          ({data: {pokemons: pokemons}, loading, fetchMore}) => (
            <PokemonList
              entries={pokemons}
              loading={loading}
              onLoadMore= {() => fetchMore({
                variables :{
                  pokemonShow
                },
                updateQuery: (previousResult, {fetchMoreResult}) => {
                  const previousEntry =  previousResult.pokemons
                  const newPokemons = previousResult.pokemons

                  return {
                    pokemons: [...previousEntry, ...newPokemons],
                    __typename: previousEntry.__typename
                  }
                }
              })
              }
              />
          )
        }
      </Query>
    )
  }
}