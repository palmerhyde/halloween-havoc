import { takeLatest, call, put, all, select } from "redux-saga/effects";
import axios from "axios";
import { delay } from "redux-saga";

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

const DISCOVER_PHYSICAL_MONSTER = 'DISCOVER_PHYSICAL_MONSTER';
const DISCOVER_PHYSICAL_MONSTER_SUCCESS = 'DISCOVER_PHYSICAL_MONSTER_SUCCESS';
const DISCOVER_PHYSICAL_MONSTER_FAILURE = 'DISCOVER_PHYSICAL_MONSTER_FAILURE';

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

// Move Physical monsters to separate saga?
export function discoverPhysicalMonsters() {
    return {
        type: DISCOVER_PHYSICAL_MONSTER,
    };
}

// Saga watchers
export function* watcherMonsterSaga() {
    yield takeLatest(GET, workerMonsterSaga);
}

export function* watcherSetMonstersDominantColoursSaga() {
    yield takeLatest(SET_MONSTERS_DOMINANT_COLOURS, workerSetMonstersDominantColoursSaga);
}

export function* watcherSetMonsterColourSaga() {
    yield takeLatest(SET_MONSTER_COLOUR, workerSetMonsterColourSaga);
}

export function* watcherDiscoverPhysicalMonsterSaga() {
    yield takeLatest(DISCOVER_PHYSICAL_MONSTER, workerDiscoverPhysicalMonsterSaga);
}

// Saga workers
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
        // TODO: not all colors have values,
        // TODO: this does not belong here.
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
        let artist = yield select((state) => state.nowPlaying.nowPlaying.item.artists[0].name);
        let filteredMonsters = filterMonstersByArtist(monsters.monsters, artist);

        yield all(filteredMonsters.map(monster => {
            monster.colour = colour;
            return call(putMonster, monster);
        }));

        yield all(filteredMonsters.map(monster => {
            return call(putPhysicalMonsterColor, monster, colour);
        }));

        yield put(getMonsters());
        yield put({ type: SET_MONSTERS_DOMINANT_COLOURS_SUCCESS, monsters });
    } catch (error) {
        console.log(error);
        yield put({ type: SET_MONSTERS_DOMINANT_COLOURS_FAILURE, error });
    }
}

function* workerSetMonsterColourSaga({ payload: payload }) {
    try {
        console.log(payload);
        let colour = payload.colour;
        let monster = payload.monster;
        monster.colour = colour;
        yield call(putMonster, monster);
        yield call(putPhysicalMonsterColor, monster, colour);

        // Refetch monsters to get fresh state
        yield put(getMonsters());
        yield put({ type: SET_MONSTER_COLOUR_SUCCESS });
    } catch (error) {
        yield put({ type: SET_MONSTER_COLOUR_FAILURE, error });
    }
}

function* workerDiscoverPhysicalMonsterSagaStep2(monster) {
    try {
        yield call(discoverPhysicalMonster, monster);
        monster.discovered = true;
        yield call(putMonster, monster);
    } catch (error) {
        monster.discovered = false;
        yield call(putMonster, monster);
    }
}

function* workerDiscoverPhysicalMonsterSaga() {
    console.log('discovering monsters');
    let monsters = yield select((state) => state.monsters.monsters);

    if (monsters) {
        yield all(monsters.map(monster => {
            return call(workerDiscoverPhysicalMonsterSagaStep2, monster);
        }));
    }

    yield put(getMonsters());
    yield delay(10000000000000);
    yield put(discoverPhysicalMonsters());
}

// Services
function fetchMonsters() {
    return axios({
        method: "get",
        url: "http://localhost:3004/monsters"
    });
}

function putMonster(monster) {
    return axios({
        method: "put",
        url: "http://localhost:3004/monsters/" + monster.id,
        data: monster
    });
}

function putPhysicalMonsterColor(monster, colour) {
    // Only make call if monster.auto and monster.discovered
    // Start with discovered
    if (monster.discovered) {
        return axios({
            method: "get",
            url: `http://${monster.dns}/setcolour?r=${colour.r}&g=${colour.g}&b=${colour.b}`
        });
    } else {
        console.log(`${monster.title} not discovered`);
        return;
    }
}

function discoverPhysicalMonster(monster) {
    return axios({
        method: "get",
        url: `http://${monster.dns}`
    });
}

export function filterMonstersByArtist(monsters, artist) {
    // Helper Utilities
    // DEMO: Step X - Write a unit test for this function
    // TODO: support multiple artists
    let monstersArray =  monsters.filter( monster => {
        return monster.artist.toLowerCase() === artist.toLowerCase();
    });

    return monstersArray;
}

export function getVibrantColour() {

}