import { delay } from 'redux-saga'
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { setMonstersDominantColours } from './monsters'
import SpotifyWebApi from 'spotify-web-api-js';
import * as Vibrant from 'node-vibrant'

const spotifyApi = new SpotifyWebApi();

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

// Selectors

// Sagas

// Watchers
export function* watcherNowPlayingSaga() {
    yield takeLatest(GET, workerNowPlayingSaga);
}

export function* watcherSetNowPlayingAuthTokenSaga() {
    yield takeLatest(SET_SPOTIFY_AUTH_TOKEN, workerNowPlayingSaga);
}

// Workers
function* workerNowPlayingSaga() {
    const RETRY_TIMER = 10000;

    try {
        let accessToken = yield select((state) => state.nowPlaying.authToken);
        spotifyApi.setAccessToken(accessToken);
        const nowPlaying = yield call(fetchNowPlaying);

        console.log('now playing' + nowPlaying);

        if (!nowPlaying) {
            let error = {
                'response': {
                    'error' : {
                        'status': 401,
                        'message': 'No song playing'
                    }
                }
            };

            error.response = JSON.stringify(error.response);
            throw(error);
        }

        // TODO: validate response.
        yield put({ type: GET_SUCCESS, nowPlaying });

        // TODO: run the next two yields in parallel
        const dominantColours = yield call(getDominantColours, nowPlaying.item.album.images[0].url);
        // Set monster colour to dominant colours
        yield put(setMonstersDominantColours(dominantColours));

        // Call now playing when the current song has finished
        //let timer = (nowPlaying.item.duration_ms - nowPlaying.progress_ms) + 1500;
        yield delay(RETRY_TIMER);
        yield put(getNowPlaying());

    } catch (error) {
        // generate errors from an error helper class
        //{ "error": { "status": 401, "message": "Invalid access token" } }
        //{ "error": { "status": 401, "message": "No token provided" } }
        //{ "error": { "status": 401, "message": "No song playing" } }
        console.log(error.response);
        yield put({ type: GET_FAILURE, error: JSON.parse(error.response) });
        yield delay(RETRY_TIMER);
        yield put(getNowPlaying());
    }
}

// Selectors

// Services
function fetchNowPlaying() {
    // ensure we have a token, otherwise throw an error
    return spotifyApi.getMyCurrentPlaybackState();
}

function getDominantColours(url) {
    // TODO: understand this transformation
    return Vibrant.from(url).getPalette()
        .then(response => {
            console.log(response);
            const keys = Object.keys(response);
            const addPalette = (acc, paletteName) => ({
                ...acc,
                [paletteName]: response[paletteName] && response[paletteName].getRgb()
            });

            return keys.reduce(addPalette, {});
        })
}