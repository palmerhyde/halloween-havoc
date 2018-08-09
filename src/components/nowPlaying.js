import React from 'react';
import NothingPlaying from './nothingPlaying';
import Fetching from './fetching';
import PropTypes from 'prop-types';

class nowPlaying extends React.PureComponent {



    render() {
        return (
            <div>

                { this.props.nowPlaying && this.props.nowPlaying.fetching ?
                    (<Fetching/>) :
                    (<h2>Now Playing</h2>)
                }

                <div className='card-container'>
                    <div className="card-link">
                { this.props.nowPlaying && this.props.nowPlaying.nowPlaying ? (
                    <div className="card">
                        <div
                            className='album-card-header'
                            style={{backgroundImage: `url(${this.props.nowPlaying.nowPlaying.item.album.images[1].url})`}}
                        />
                        <div className="album-card-body">
                            <div className="user-card-name">{ this.props.nowPlaying.nowPlaying.item.name }</div>
                        </div>
                        <div className="user-card-stats">
                            <div className="stat-container">
                                <div className="stat-value">Album</div>
                                <div className="stat-name">{ this.props.nowPlaying.nowPlaying.item.album.name }</div>
                            </div>
                            <div className="stat-container">
                                <div className="stat-value">Artists</div>
                                <div className="stat-name">
                                    { this.props.nowPlaying.nowPlaying.item.artists.map((artist, idx) => (
                                        artist.name + '\n'
                                    )) }

                                </div>
                            </div>
                            <div className="stat-container">
                                <div className="stat-value">Duration</div>
                                <div className="stat-name">{ this.props.nowPlaying.nowPlaying.progress_ms } - {this.props.nowPlaying.nowPlaying.item.duration_ms}</div>
                            </div>
                        </div>
                    </div>
                ) : (<div className="card-link">
                    { this.props.nowPlaying && this.props.nowPlaying.error && this.props.nowPlaying.error.error ? (
                        <NothingPlaying message={this.props.nowPlaying.error.error.message} authToken={this.props.nowPlaying.authToken} onSetSpotifyAuthToken={this.props.onSetSpotifyAuthToken}/>
                    ) : (null)}
                    </div>
                    )}
                </div>
                </div>
            </div>
        );
    }
}

nowPlaying.propTypes = {
    nowPlaying: PropTypes.object
};

export default nowPlaying;