// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null, key: null}
//   static getDerivedStateFromError(error) {
//     return {error};
//   }
//   componentDidCatch(error, info) {
//     console.log(error, info.componentStack);
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       // You can render any custom fallback UI
//       return <this.props.FallbackComponent error={error}/>
//     }
//     return this.props.children;
//   }
// }

function PokemonInfo({pokemonName}) {
  const [{pokemon, error, status}, setState] = React.useState({
    pokemon: null,
    error: null,
    status: pokemonName ? 'pending' : 'idle'
  })

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(
      () => {
        // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
        if (!pokemonName) return

        // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
        // (This is to enable the loading state when switching between different pokemon.)
        setState({status: 'pending'})
        fetchPokemon(pokemonName).then(
            pokemon => {
              setState({pokemon, status: 'resolved'})
            },
            error => {
              setState({status: 'rejected', error})
            }
        )
      },
      // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
      [pokemonName]
  )

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  switch (status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName}/>
    case 'resolved':
      return <PokemonDataView pokemon={pokemon}/>
    case 'rejected':
      // return ErrorFallback({error})
      throw error
    default:
      // throw new Error("This should be unreachable. `status` has an unexpected value")
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
