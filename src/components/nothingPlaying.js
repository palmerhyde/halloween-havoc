import React from 'react';
import NothingPlayingError from './nothingPlayingError'; 

class nothingPlaying extends React.PureComponent {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onSetSpotifyAuthToken(event.target.value);
    }

    render() {
        const { authToken, message } = this.props;
        return (
            <div className="card">
                <div
                    className='user-card-header'
                />
                <div
                    className='user-card-avatar'
                    style={{backgroundImage: `url('https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/092014/spotify_2014_0.png?itok=G4OTrLGf')`}}
                >
                </div>
                <NothingPlayingError errorMessage={message} />
                <div className="user-card-stats">
                    <div className="stat-container">
                        <div className="stat-value">Token</div>
                        <input type="text" value={authToken} onChange={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    }
}

export default nothingPlaying;