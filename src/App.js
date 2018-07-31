import React, { Component } from 'react';
import { connect } from "react-redux";
import { getMonsters } from './redux/ducks/monsters';
import { getNowPlaying } from './redux/ducks/spotifyNowPlaying';
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color';
import NowPlaying from './components/nowPlaying'
import MonsterCard from './components/monsterCard'
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        displayColorPicker: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },
    };

    componentDidMount() {
        const { onRequestMonsters, onRequestNowPlaying } = this.props;
        onRequestMonsters();
        onRequestNowPlaying();
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
    };
    render() {
        const { fetching, nowPlaying, error, monsters } = this.props;
        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: ',0px',
                },
            },
        });

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
        <p className="App-intro">
          Select a colour.
        </p>
          <div>
              <div style={ styles.swatch } onClick={ this.handleClick }>
                  <div style={ styles.color } />
              </div>
              { this.state.displayColorPicker ? <div style={ styles.popover }>
                  <div style={ styles.cover } onClick={ this.handleClose }/>
                  <ChromePicker color={ this.state.color } onChange={ this.handleChange } disableAlpha={true} />
              </div> : null }

          </div>

          {nowPlaying && nowPlaying.nowPlaying ? (
              <NowPlaying nowPlaying={nowPlaying.nowPlaying}/>
          ) : (
              null
          )}

          {monsters && monsters.monsters &&  monsters.monsters.length > 0 ? (
              monsters.monsters.map((monster, idx) => (
                  <MonsterCard monster={monster}/>
              ))
          )
              : (
                  <div>Loading Monsters...</div>
              )
          }

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
        onRequestNowPlaying: () => dispatch(getNowPlaying())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);