import React, { Component } from 'react';
import { connect } from "react-redux";
import {getMonsters, setMonsterColour, discoverPhysicalMonsters} from './redux/ducks/monsters';
import { getNowPlaying, setSpotifyAuthToken } from './redux/ducks/spotifyNowPlaying';
import NowPlaying from './components/nowPlaying';
import MonsterCard from './components/monsterCard'
import logo from './logo.svg';
import './App.css';

class App extends Component {

    componentDidMount() {
        const { onRequestMonsters, onRequestNowPlaying, onDiscoverMonsters, monsters } = this.props;
        onRequestMonsters();
        onRequestNowPlaying();
        onDiscoverMonsters();
    }

    render() {
        const { fetching, nowPlaying, error, monsters, onSetMonsterColour, onSetSpotifyAuthToken } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Halloween Havoc</h1>
        </header>

          {fetching ? (
              <button disabled>Fetching...</button>
          ) : (
              null
          )}

          {error && <p style={{ color: "red" }}>Uh oh - something went wrong!</p>}

          <NowPlaying nowPlaying={nowPlaying} onSetSpotifyAuthToken={onSetSpotifyAuthToken}/>

          <h2>Active Monsters</h2>
          <div className='card-container'>
          {monsters && monsters.monsters &&  monsters.monsters.length > 0 ? (
              monsters.monsters.map((monster, idx) => (
                  <MonsterCard monster={monster} onSetMonsterColour={onSetMonsterColour} key={`active-monster-${idx}`}/>
              ))

          )
              : (
                  <div>Loading Monsters...</div>
              )
          }
          </div>

          <h2>Inactive Monsters</h2>
          <div className='card-container'>
              {monsters && monsters.monsters &&  monsters.monsters.length > 0 ? (
                      monsters.monsters.map((monster, idx) => (
                          <MonsterCard monster={monster} onSetMonsterColour={onSetMonsterColour} key={`inactive-monster-${idx}`}/>
                      ))

                  )
                  : (
                      <div>Loading Monsters...</div>
                  )
              }
          </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        fetching: state.fetching,
        error: state.error,
        nowPlaying : state.nowPlaying,
        monsters: state.monsters
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestMonsters: () => dispatch(getMonsters()),
        onRequestNowPlaying: () => dispatch(getNowPlaying()),
        onSetMonsterColour: (payload) => dispatch(setMonsterColour(payload)),
        onSetSpotifyAuthToken: (payload) => dispatch(setSpotifyAuthToken(payload)),
        onDiscoverMonsters: () => dispatch(discoverPhysicalMonsters())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);