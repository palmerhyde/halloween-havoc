import React from 'react';

class nothingPlaying extends React.PureComponent {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getMessage = this.getMessage.bind(this);
    }

    handleChange(event) {
        this.props.onSetSpotifyAuthToken(event.target.value);
    }

    // TODO: this should be a component.
    getMessage(error) {
        switch (error) {
            case 'No token provided':
                return <div>No token provided. Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">spotify</a> to request a token and cut-paste it below.</div>
            case 'No song playing':
                return <div>Nothing playing on spotify. Please play something.</div>
            case 'Invalid access token':
                return <div>Invalid token. Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">spotify</a> to request a token and cut-paste it below.</div>
            case 'The access token expired':
                return <div>Token expired. Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">spotify</a> to renew a token and cut-paste it below.</div>

            default:
                return 'some random error.'
        }
    }

    render() {
        // send user here to get a token
        // https://developer.spotify.com/console/get-users-currently-playing-track/

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
                <div className="user-card-body">
                    {this.getMessage(this.props.message)}
                </div>
                <div className="user-card-stats">
                    <div className="stat-container">
                        <div className="stat-value">Token</div>
                        <input type="text" value={this.props.authToken} onChange={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    }
}

export default nothingPlaying;