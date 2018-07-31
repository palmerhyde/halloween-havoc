import { delay } from 'redux-saga'
import { takeLatest, call, put } from 'redux-saga/effects';
import { setMonsterColours } from './monsters'
import SpotifyWebApi from 'spotify-web-api-js';
import * as Vibrant from 'node-vibrant'

const spotifyApi = new SpotifyWebApi();

// TODO - do not hard code spotify token
// set token in the now playing component.
// send to state
// how do you get access to state within a saga?
spotifyApi.setAccessToken('');

// Actions
const GET = 'SPOTIFY_NOW_PLAYING_API_GET_REQUEST';
const GET_SUCCESS = 'SPOTIFY_NOW_PLAYING_GET_REQUEST_SUCCESS';
const GET_FAILURE = 'SPOTIFY_NOW_PLAYING_GET_REQUEST_FAILURE';

// Reducer
const initialState = null;

export default function spotifyNowPlayingReducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return { ...state, fetching: true, error: null };
        case GET_SUCCESS:
            return { ...state, fetching: false, nowPlaying: action.nowPlaying };
        case GET_FAILURE:
            return { ...state, fetching: false, nowPlaying: null, error: action.error };
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

// Selectors

// Sagas
export function* watcherNowPlayingSaga() {
    yield takeLatest(GET, workerNowPlayingSaga);
}

function* workerNowPlayingSaga() {
    try {
        const response = yield call(fetchNowPlaying);
        const nowPlaying = response;


        // TODO: validate response.
        yield put({ type: GET_SUCCESS, nowPlaying });
        // TODO: get from state not nowPlaying
        // TODO: run the next two yields in parallel
        const dominantColours = yield call(getDominantColours, nowPlaying.item.album.images[0].url);
        // Set monster colour to dominant colours
        yield put(setMonsterColours(dominantColours));

        // Call now playing when the current song has finished
        let timer = (nowPlaying.item.duration_ms - nowPlaying.progress_ms) + 1500;
        yield delay(timer);
        yield put(getNowPlaying());

    } catch (error) {
        yield put({ type: GET_FAILURE, error });
    }
}

// Selectors

// Services
function fetchNowPlaying() {
    // ensure we have a token, otherwise throw an error
    return spotifyApi.getMyCurrentPlaybackState();
}

function getDominantColours(url) {
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