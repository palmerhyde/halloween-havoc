import { delay } from 'redux-saga'
import { takeLatest, call, put } from "redux-saga/effects";
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
var timer = 0;

// TODO - do not hard code spotify token
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

        yield put({ type: GET_SUCCESS, nowPlaying });
        timer = (nowPlaying.item.duration_ms - nowPlaying.progress_ms) + 1500;
        //setTimeout(dispatchFromTimer, 5000);
        yield delay(timer);
        yield put(getNowPlaying());

    } catch (error) {
        yield put({ type: GET_FAILURE, error });
    }
}

// Services
function fetchNowPlaying() {
    return spotifyApi.getMyCurrentPlaybackState();
}

// Timer for when to dispatch again.