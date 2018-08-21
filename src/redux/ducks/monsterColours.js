import { takeLatest, call, put, select } from 'redux-saga/effects';
import { setMonstersDominantColours } from './monsters'
import * as Vibrant from 'node-vibrant'
import axios from "axios/index";

// Actions
const PROCESS = 'MONSTER_COLOURS_PROCESS';
const PROCESS_SUCCESS = 'MONSTER_COLOURS_PROCESS_SUCCESS';
const PROCESS_FAILURE = 'MONSTER_COLOURS_PROCESS_FAILURE';

// Reducer
const initialState = {
    processing: true,
    error: '',
    colours: [],
    currentIndex: -1
};

export default function monsterColoursReducer(state = initialState, action) {
    switch (action.type) {
        case PROCESS:
            return { ...state, processing: true, error: null };
        case PROCESS_SUCCESS:
            return { ...state, processing: false, colours: action.colours, currentIndex: action.currentIndex };
        case PROCESS_FAILURE:
            return { ...state, processing: false, colours: null, error: action.error };
        default:
            return state;
    }
}

// Action Creators
export function processMonsterColours(url) {
    return {
        type: PROCESS,
        url: url
    };
}

// Saga Watchers
export function* watcherProcessMonsterColours() {
    yield takeLatest(PROCESS, workerProcessMonsterColours);
}

// Saga Workers
function* workerProcessMonsterColours({url: url}) {
    try {
        console.log('album url:' +url);
        const colours = [];
        const dominantColours = yield call(getDominantColours, url);
        let currentIndex = yield select((state) => state.monsterColours.currentIndex);
        yield put({ type: PROCESS_SUCCESS, colours: dominantColours, currentIndex: calculateCurrentIndex(currentIndex, dominantColours) });
        yield put(setMonstersDominantColours());
    } catch (error) {
        yield put({ type: PROCESS_FAILURE, error: 'something went wrong processing monster colours'});
    }
}

// Helper utilities
export function getDominantColours(url) {
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

export function calculateCurrentIndex(currentIndex, colours) {
    const colourCount = colours.length;
    console.log('colour count:' + colourCount);
    console.log('colours:' + colours);
    return currentIndex +1;
}