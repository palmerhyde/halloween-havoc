import React from 'react';
import PropTypes from 'prop-types';
import {UserCard} from 'react-ui-cards';

class monsterCard extends React.PureComponent {
    render() {
        const { monster } = this.props;
        return (
            <div className='card-container' key={`monster-${monster.id}`}>
                <UserCard
                    header={monster.header}
                    avatar={monster.avatar}
                    name={monster.title}
                    stats={[
                        {
                            name: monster.artist,
                            value: 'Artist'
                        },
                        {
                            name: monster.colour.r + ' ' + monster.colour.g + ' ' + monster.colour.b,
                            value: 'Colour'
                        },
                        {
                            name: 'false',
                            value: 'Active'
                        }
                    ]}
                />
            </div>
        );
    }
}

// TODO: validate vshape props
monsterCard.propTypes = {
    monster: PropTypes.object.isRequired
};

export default monsterCard;