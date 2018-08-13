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
        const accessToken = yield select((state) => state.nowPlaying.authToken);
        spotifyApi.setAccessToken(accessToken);
        const nowPlaying = yield call(fetchNowPlaying);

        if (!nowPlaying) {
            throw(getNothingPlayingError());
        }

        yield put({ type: GET_SUCCESS, nowPlaying });

        // TODO: run the next two yields in parallel
        const albumImageUrl = yield select((state) => state.nowPlaying.nowPlaying.item.album.images[0].url);
        const dominantColours = yield call(getDominantColours, albumImageUrl);
        yield put(setMonstersDominantColours(dominantColours));
        yield delay(RETRY_TIMER);
        yield put(getNowPlaying());

    } catch (error) {
        // generate errors from an error helper class
        //{ "error": { "status": 401, "message": "Invalid access token" } }
        //{ "error": { "status": 401, "message": "No token provided" } }
        // what about a time out?
        //console.log(error);
        if (!error || !error.response || error.response === '') {
            error = getEmptyResponseError();
        }

        yield put({ type: GET_FAILURE, error: JSON.parse(error.response) });
        yield delay(RETRY_TIMER);
        yield put(getNowPlaying());
    }
}

// Services
function fetchNowPlaying() {
    return spotifyApi.getMyCurrentPlaybackState();
}

// Helper utilities
function getDominantColours(url) {
    // TODO: understand this transformation
    // unit test
    // move the call to Vibrant.From to a parent yield so we an unit test the logic.
    return Vibrant.from(url).getPalette()
        .then(response => {
            const keys = Object.keys(response);
            const addPalette = (acc, paletteName) => ({
                ...acc,
                [paletteName]: response[paletteName] && response[paletteName].getRgb()
            });

            return keys.reduce(addPalette, {});
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