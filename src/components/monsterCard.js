import React from 'react';
import PropTypes from 'prop-types';

class monsterCard extends React.PureComponent {
    render() {
        const { monster } = this.props;

        return (
            <div className="card-link">
                <div className="card card-link">
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
                            <div className="stat-value">Colours</div>
                            <div className="stat-name">{monster.colour.r + ' ' + monster.colour.g + ' ' + monster.colour.b}</div>
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

// TODO: validate vshape props
monsterCard.propTypes = {
    monster: PropTypes.object.isRequired
};

export default monsterCard;