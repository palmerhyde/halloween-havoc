import React, { Component } from 'react';
import { connect } from "react-redux";
import { getMonsters } from './redux/ducks/monsters';
import { getDog } from './redux/ducks/dogs';
import { getNowPlaying } from './redux/ducks/spotifyNowPlaying';
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color';
import {UserCard} from 'react-ui-cards';
import NowPlaying from './components/nowPlaying'
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
        const { fetching, dog, nowPlaying, onRequestMonsters, onRequestDog, onRequestNowPlaying, error } = this.props;
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
          <img src={dog || logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Halloween Havoc</h1>
        </header>

          {fetching ? (
              <button disabled>Fetching...</button>
          ) : (
              <div>
                  <button onClick={onRequestMonsters}>Request monsters</button>
                  <button onClick={onRequestDog}>Request dog</button>
                  <button onClick={onRequestNowPlaying}>Request now playing</button>
              </div>
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

          <h2>
              Monster cards
          </h2>
          <div className='card-container'>
              <UserCard
                  header='https://i.ytimg.com/vi/Tn6ifBAMaPg/maxresdefault.jpg'
                  avatar='https://images-na.ssl-images-amazon.com/images/I/71v6kW3BNQL._SX425_.jpg'
                  name='Eddie'
                  positionName='Powerslave'
                  stats={[
                      {
                          name: 'Powerslave',
                          value: 'Album'
                      },
                      {
                          name: 'Red',
                          value: 'Colour'
                      },
                      {
                          name: 'false',
                          value: 'Active'
                      }
                  ]}
              />
          </div>
          <div className='card-container'>
              <UserCard
                  header='https://i0.wp.com/www.goodmusicmatters.net/wp-content/uploads/2016/04/Book-Of-Souls-Art.jpg'
                  avatar='https://cdn.shopify.com/s/files/1/0744/5517/products/iron-maiden-book-souls-mask-2_large.jpg?v=1527556324'
                  name='Eddie'
                  positionName='Book of Souls'
                  stats={[
                      {
                          name: 'Book of souls',
                          value: 'Album'
                      },
                      {
                          name: 'Green',
                          value: 'Colour'
                      },
                      {
                          name: 'false',
                          value: 'Active'
                      }
                  ]}
              />
          </div>
          <div className='card-container'>
              <UserCard
                  header='http://assets.blabbermouth.net/media/ghostmeliorapromobwbiggernew_638.jpg'
                  avatar='https://images.maskworld.com/is/image/maskworld/bigview/ghost-papa-emeritus-ii-miter-and-mask--mw-132812-1.jpg'
                  name='Papa Emeritus II'
                  positionName='Ghost'
                  stats={[
                      {
                          name: 'Ghost',
                          value: 'Artist'
                      },
                      {
                          name: 'Silver',
                          value: 'Colour'
                      },
                      {
                          name: 'false',
                          value: 'Active'
                      }
                  ]}
              />
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        fetching: state.fetching,
        dog: state.dog,
        error: state.error,
        nowPlaying : state.nowPlaying
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestMonsters: () => dispatch(getMonsters()),
        onRequestDog: () => dispatch(getDog()),
        onRequestNowPlaying: () => dispatch(getNowPlaying())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);