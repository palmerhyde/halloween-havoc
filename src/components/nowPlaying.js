import React from 'react';
import PropTypes from 'prop-types';

class nowPlaying extends React.PureComponent {
    render() {
        return (
            <div>
                <div>
                    Now Playing: { this.props.nowPlaying.item.name }
                </div>
                <div>
                    Album: { this.props.nowPlaying.item.album.name }
                </div>
                <div>
                    Artist: { this.props.nowPlaying.item.artists[0].name }
                </div>
                <div>
                    Progress: { this.props.nowPlaying.progress_ms } - {this.props.nowPlaying.item.duration_ms}
                </div>
                <div>
                    <img src={this.props.nowPlaying.item.album.images[1].url} style={{ height: 150 }}/>
                </div>
            </div>
        );
    }
}

nowPlaying.propTypes = {
    nowPlaying: PropTypes.object.isRequired
};

export default nowPlaying;