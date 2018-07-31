import { select } from "redux-saga/effects";
import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {getNowPlaying} from "./spotifyNowPlaying";

// Actions
const GET = 'MONSTER_API_GET_REQUEST';
const GET_SUCCESS = 'MONSTER_API_GET_REQUEST_SUCCESS';
const GET_FAILURE = 'MONSTER_API_GET_REQUEST_FAILURE';
const SET_MONSTER_COLOURS = 'SET_MONSTER_COLOURS';
const SET_MONSTER_COLOURS_SUCCESS = 'SET_MONSTER_COLOURS_SUCCESS';
const SET_MONSTER_COLOURS_FAILURE = 'SET_MONSTER_COLOURS_FAILURE';

// Reducer
const initialState = [];

export default function monstersReducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return { ...state, fetching: true, error: null };
        case GET_SUCCESS:
            console.log('monsters:' + action.monsters);
            return { ...state, fetching: false, monsters: action.monsters };
        case GET_FAILURE:
            return { ...state, fetching: false, monsters: [], error: action.error };
        //case SET_MONSTER_COLOURS:
          //  return {...state};
        default:
            return state;
    }
}

// Action Creators
export function getMonsters() {
    return {
        type: GET,
    };
}


// Action Creators
export function setMonsterColours(payload) {
    return {
        type: SET_MONSTER_COLOURS,
        payload: payload
    };
}

// Selectors

// Sagas
export function* watcherMonsterSaga() {
    yield takeLatest(GET, workerMonsterSaga);
}

export function* watcherSetMonsterColoursSaga() {
    yield takeLatest(SET_MONSTER_COLOURS, workerSetMonsterColourSaga);
}

function* workerMonsterSaga() {
    try {
        const response = yield call(fetchMonsters);
        console.log('response:' + JSON.stringify(response));
        const monsters = response.data;

        yield put({ type: GET_SUCCESS, monsters });

    } catch (error) {
        yield put({ type: GET_FAILURE, error });
    }
}

function* workerSetMonsterColourSaga({ payload: colours }) {
    console.log(colours);
    let colour = {
        'r' : colours.Vibrant[0],
        'g' : colours.Vibrant[1],
        'b' : colours.Vibrant[2]
    };

    // For each monster
    let monsters = yield select((state) => state.monsters);
    console.log(monsters);

    // Filter monsters where artist in nowPlaying.artists
    const response = yield call(setMonsterColor, monsters.monsters[0], colour);

    // Refetch monsters to get fresh state
    yield put(getMonsters());
}

// Services
function fetchMonsters() {
    return axios({
        method: "get",
        url: "http://localhost:3004/monsters"
    });
}

function setMonsterColor(monster, colour) {
    monster.colour = colour;
    return axios({
        method: "put",
        url: "http://localhost:3004/monsters/" + monster.id,
        data: monster
    });
}