import { select } from "redux-saga/effects";
import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

// Actions
const GET = 'MONSTER_API_GET_REQUEST';
const GET_SUCCESS = 'MONSTER_API_GET_REQUEST_SUCCESS';
const GET_FAILURE = 'MONSTER_API_GET_REQUEST_FAILURE';

const SET_MONSTERS_DOMINANT_COLOURS = 'SET_MONSTERS_DOMINANT_COLOURS';
const SET_MONSTERS_DOMINANT_COLOURS_SUCCESS = 'SET_MONSTERS_DOMINANT_COLOURS_SUCCESS';
const SET_MONSTERS_DOMINANT_COLOURS_FAILURE = 'SET_MONSTERS_DOMINANT_COLOURS_FAILURE';

const SET_MONSTER_COLOUR = 'SET_MONSTER_COLOUR';
const SET_MONSTER_COLOUR_SUCCESS = 'SET_MONSTER_COLOUR_SUCCESS';
const SET_MONSTER_COLOUR_FAILURE = 'SET_MONSTER_COLOUR_FAILURE';

const SET_PHYSICAL_MONSTER_COLOUR = 'SET_PHYSICAL_MONSTER_COLOUR';
const SET_PHYSICAL_MONSTER_COLOUR_SUCCESS = 'SET_PHYSICAL_MONSTER_COLOUR_SUCCESS';
const SET_PHYSICAL_MONSTER_COLOUR_FAILURE = 'SET_PHYSICAL_MONSTER_COLOUR_FAILURE';

// Reducer
const initialState = [];

export default function monstersReducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return { ...state, fetching: true, error: null };
        case GET_SUCCESS:
            return { ...state, fetching: false, monsters: action.monsters };
        case GET_FAILURE:
            return { ...state, fetching: false, monsters: [], error: action.error };
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
export function setMonstersDominantColours(payload) {
    return {
        type: SET_MONSTERS_DOMINANT_COLOURS,
        payload: payload
    };
}

export function setMonsterColour(payload) {
    return {
        type: SET_MONSTER_COLOUR,
        payload: payload
    };
}

// Selectors

// Sagas
export function* watcherMonsterSaga() {
    yield takeLatest(GET, workerMonsterSaga);
}

export function* watcherSetMonstersDominantColoursSaga() {
    yield takeLatest(SET_MONSTERS_DOMINANT_COLOURS, workerSetMonstersDominantColoursSaga);
}

export function* watcherSetMonsterColourSaga() {
    yield takeLatest(SET_MONSTER_COLOUR, workerSetMonsterColourSaga);
}

function* workerMonsterSaga() {
    try {
        const response = yield call(fetchMonsters);
        const monsters = response.data;
        yield put({ type: GET_SUCCESS, monsters });

    } catch (error) {
        yield put({ type: GET_FAILURE, error });
    }
}

function* workerSetMonstersDominantColoursSaga({ payload: colours }) {
    try {
        console.log(colours);

        // TODO: not all colors have values,
        // DarkMuted
        // DarkVibrant
        // LightMuted
        // LightVibrant
        // Muted
        // Vibrant
        // Default

        let colour = {
            'r': colours.Vibrant[0],
            'g': colours.Vibrant[1],
            'b': colours.Vibrant[2]
        };

        // For each monster
        let monsters = yield select((state) => state.monsters);
        let filteredMonsters = filterMonstersByArtist(monsters[0], 'iron maiden');

        // Filter monsters where artist in nowPlaying.artists
        const response = yield call(putMonsterColor, monsters.monsters[0], colour);
        const response2 = yield call(putPhysicalMonsterColor, monsters.monsters[0], colour);

        // Refetch monsters to get fresh state
        yield put(getMonsters());
        yield put({ type: SET_MONSTERS_DOMINANT_COLOURS_SUCCESS, monsters });
    } catch (error) {
        yield put({ type: SET_MONSTERS_DOMINANT_COLOURS_FAILURE, error });
    }
}

function* workerSetMonsterColourSaga({ payload: payload }) {
    try {
        console.log(payload);
        let colour = payload.colour;
        let monster = payload.monster;

        // Filter monsters where artist in nowPlaying.artists
        const response = yield call(putMonsterColor, monster, colour);
        const response2 = yield call(putPhysicalMonsterColor, monster, colour);

        // Refetch monsters to get fresh state
        yield put(getMonsters());
        yield put({ type: SET_MONSTER_COLOUR_SUCCESS });
    } catch (error) {
        yield put({ type: SET_MONSTER_COLOUR_FAILURE, error });
    }
}

// Services
function fetchMonsters() {
    return axios({
        method: "get",
        url: "http://localhost:3004/monsters"
    });
}

function putMonsterColor(monster, colour) {
    monster.colour = colour;
    return axios({
        method: "put",
        url: "http://localhost:3004/monsters/" + monster.id,
        data: monster
    });
}

function putPhysicalMonsterColor(monster, colour) {
    return axios({
        method: "get",
        url: `http://powerslave.local/setcolour?r=${colour.r}&g=${colour.g}&b=${colour.b}`
    });
}


// Helper Utilities
function filterMonstersByArtist(monsters, artist) {
    return monsters;
}

function getVibrantColour() {

}