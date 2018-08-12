import React from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color';

class monsterCard extends React.PureComponent {

    state = {
        displayColourPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColourPicker: !this.state.displayColourPicker });
        console.log('clicked colour on monster;')
    };

    handleClose = () => {
        this.setState({ displayColourPicker: false })
    };

    handleChange = (colour) => {
        let payload = {
            colour: colour.rgb,
            monster: this.props.monster
        };

        this.props.onSetMonsterColour(payload);
    };

    render() {
        const { monster } = this.props;
        const styles = reactCSS({
            'default': {
                colour: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgb(${ monster.colour.r }, ${ monster.colour.g }, ${ monster.colour.b })`,
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
                    zIndex: '11',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: ',0px',
                }
            }
        });

        return (
            <div className="card-link">
                <div className="card">
                    <div
                        className='user-card-header'
                        style={{backgroundImage: `url(${monster.header})`}}
                    />
                    <div
                        className='user-card-avatar'
                        style={{backgroundImage: `url(${monster.avatar})`}}
                    >
                    </div>

                    <div className="user-card-body">
                        <div className="user-card-name">{monster.title}</div>
                    </div>
                    <div className="user-card-stats">
                        <div className="stat-container">
                            <div className="stat-value">Artists</div>
                            <div className="stat-name">{monster.artist}</div>
                        </div>
                        <div className="stat-container">
                            <div className="stat-value">Colour</div>
                            <div>
                                <div style={ styles.swatch } onClick={ this.handleClick }>
                                    <div style={ styles.colour } />
                                </div>
                                { this.state.displayColourPicker ? <div style={ styles.popover }>
                                    <div style={ styles.cover } onClick={ this.handleClose }/>
                                    <ChromePicker
                                        color={ `rgb(${ monster.colour.r }, ${ monster.colour.g }, ${ monster.colour.b })` }
                                        onChangeComplete={ this.handleChange }
                                        disableAlpha={true} />
                                </div> : null }

                            </div>
                        </div>
                        <div className="stat-container">
                            <div className="stat-value">Active</div>
                            <div className="stat-name">true</div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

// TODO: validate shape props
monsterCard.propTypes = {
    monster: PropTypes.object.isRequired,
    onSetMonsterColour: PropTypes.func.isRequired
};

export default monsterCard;