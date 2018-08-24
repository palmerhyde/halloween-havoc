import React from 'react';
import PropTypes from 'prop-types';

class nothingPlayingError extends React.PureComponent {

    getMessage(error) {
        switch (error) {
            case 'No token provided':
            case 'Only valid bearer authentication supported':
                return <div>
                        <p className="errorType">No token provided.</p>
                        <span>Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">Spotify</a> to request a token and cut-paste it below.</span>
                    </div>
            case 'No song playing':
                return <div>
                        <p className="errorType">Nothing playing on Spotify.</p>
                        <span>Please play something.</span>
                    </div>

            case 'Invalid access token':
                return <div>
                        <p className="errorType">Invalid token.</p>
                        <span>Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">Spotify</a> to request a token and cut-paste it below.</span>
                    </div>
            case 'The access token expired':
                return <div>
                        <p className="errorType">Token expired.</p>
                        <span>Please go to <a href="https://developer.spotify.com/console/get-users-currently-playing-track/" target="_blank">Spotify</a> to renew a token and cut-paste it below.</span>
                    </div>
            default:
                return <p className="errorType">Some random error.</p>
        }
    }

    render() {
        return (
            <div className="error">
                {this.getMessage(this.props.errorMessage)}
            </div>
        );
    }
}

nothingPlayingError.propTypes = {
    errorMessage: PropTypes.string.isRequired
};

export default nothingPlayingError;