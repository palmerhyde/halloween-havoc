import React, { Component } from 'react';
import { connect } from "react-redux";
import { getMonsters, setMonsterColour } from './redux/ducks/monsters';
import { getNowPlaying } from './redux/ducks/spotifyNowPlaying';
import NowPlaying from './components/nowPlaying'
import MonsterCard from './components/monsterCard'
import logo from './logo.svg';
import './App.css';

class App extends Component {

    componentDidMount() {
        const { onRequestMonsters, onRequestNowPlaying } = this.props;
        onRequestMonsters();
        onRequestNowPlaying();
    }

    render() {
        const { fetching, nowPlaying, error, monsters, onSetMonsterColour } = this.props;

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

          {nowPlaying && nowPlaying.nowPlaying ? (
              <NowPlaying nowPlaying={nowPlaying.nowPlaying}/>
          ) : (
              null
          )}

          <h2>Monsters</h2>
          <div className='card-container'>
          {monsters && monsters.monsters &&  monsters.monsters.length > 0 ? (
              monsters.monsters.map((monster, idx) => (
                  <MonsterCard monster={monster} onSetMonsterColour={onSetMonsterColour} key={`monster-${idx}`}/>
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
        onSetMonsterColour: (payload) => dispatch(setMonsterColour(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);