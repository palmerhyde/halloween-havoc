import { delay } from 'redux-saga'
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { setMonstersDominantColours } from './monsters'
import { processMonsterColours } from './monsterColours'
import * as Vibrant from 'node-vibrant'
import axios from "axios/index";

// Actions
const GET = 'SPOTIFY_NOW_PLAYING_API_GET_REQUEST';
const GET_SUCCESS = 'SPOTIFY_NOW_PLAYING_GET_REQUEST_SUCCESS';
const GET_FAILURE = 'SPOTIFY_NOW_PLAYING_GET_REQUEST_FAILURE';

const SET_SPOTIFY_AUTH_TOKEN = 'SET_SPOTIFY_AUTH_TOKEN';
const SET_SPOTIFY_AUTH_TOKEN_SUCCESS = 'SET_SPOTIFY_AUTH_TOKEN_SUCCESS';
const SET_SPOTIFY_AUTH_TOKEN_FAILURE = 'SET_SPOTIFY_AUTH_TOKEN_FAILURE';

// Reducer
const initialState = {
    fetching: true,
    error: '',
    nowPlaying: null,
    authToken: ''
};

export default function spotifyNowPlayingReducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return { ...state, fetching: true, error: null };
        case GET_SUCCESS:
            return { ...state, fetching: false, nowPlaying: action.nowPlaying };
        case GET_FAILURE:
            return { ...state, fetching: false, nowPlaying: null, error: action.error };
        case SET_SPOTIFY_AUTH_TOKEN:
            return { ...state, authToken: action.authToken};
        default:
            return state;
    }
}

// Action Creators
export function getNowPlaying() {
    return {
        type: GET,
    };
}

export function setSpotifyAuthToken(authToken) {
    return {
        type: SET_SPOTIFY_AUTH_TOKEN,
        authToken: authToken
    };
}

// Saga Watchers
export function* watcherNowPlayingSaga() {
    yield takeLatest(GET, workerNowPlayingSaga);
}

export function* watcherSetNowPlayingAuthTokenSaga() {
    yield takeLatest(SET_SPOTIFY_AUTH_TOKEN, workerNowPlayingSaga);
}

// Saga Workers
function* workerNowPlayingSaga() {
    // Const belongs in config
    const RETRY_TIMER = 1000000000;

    try {
        const accessToken = yield select((state) => state.nowPlaying.authToken);
        const nowPlaying = yield call(fetchNowPlaying, accessToken);

        if (!nowPlaying) {
            throw(getNothingPlayingError());
        }

        yield put({ type: GET_SUCCESS, nowPlaying });

        // Is there a race condition here?
        const albumImageUrl = yield select((state) => state.nowPlaying.nowPlaying.data.item.album.images[0].url);
        yield put(processMonsterColours(albumImageUrl));
        //yield put(setMonstersDominantColours(dominantColours));
    } catch (error) {
        // Why no error? - error is undefined in debugger but isn't really undefined.
        // This is either a web storm error or a symbol error

        if (!error || !error.response || error.response === '') {
            error = getEmptyResponseError();
        }

        yield put({ type: GET_FAILURE, error: getResponseError(error.response.data.error.message)});
    } finally {
        yield delay(RETRY_TIMER);
        yield put(getNowPlaying());
    }
}

// Services
// TODO: belongs within spotify service
export function fetchNowPlaying(token) {
    if (!token) {
        token = '';
    }

    return axios({
        method: "get",
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

function getNothingPlayingError() {
    //{ "error": { "status": 401, "message": "No song playing" } }
    // todo: make this a generic error handler
    // Unit test
    let error = {
        'response': {
            'error' : {
                'status': 401,
                'message': 'No song playing'
            }
        }
    };

    error.response = JSON.stringify(error.response);
}

function getEmptyResponseError() {
    // todo: make this a generic error handler
    // Unit test
    let error = {
        'response': {
            'error' : {
                'status': 401,
                'message': 'Empty Response'
            }
        }
    };

    error.response = JSON.stringify(error.response);
}

function getResponseError(message) {
    // todo: make this a generic error handler
    // Unit test
    let error = {
        'response': {
            'error' : {
                'status': 401,
                'message': message
            }
        }
    };

    return error.response;
}