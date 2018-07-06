import React, { Component } from 'react';
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color';
import {UserCard} from 'react-ui-cards';
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
                    left: '0px',
                },
            },
        });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Halloween Havoc</h1>
        </header>
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

export default App;
