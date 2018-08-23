import { takeLatest, call, put, select } from 'redux-saga/effects';
import { setMonstersDominantColours } from './monsters';
import * as Vibrant from 'node-vibrant';

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
            return { ...state, processing: false, colours: action.colours, currentIndex: action.currentIndex, url: action.url };
        case PROCESS_FAILURE:
            return { ...state, processing: false, colours: null, error: action.error, url: null };
        default:
            return state;
    }
}

// Action Creators
export const processMonsterColours = (url) => {
    return {
        type: PROCESS,
        url: url
    };
};

// Saga Watchers
export function* watcherProcessMonsterColours() {
    yield takeLatest(PROCESS, workerProcessMonsterColours);
}

// Saga Workers
function* workerProcessMonsterColours({url: url}) {
    try {
        const monsterState = yield select((state) => state.monsterColours);

        const dominantColours = (url == monsterState.url
            ? monsterState.colours
            : yield call(getDominantColours, url));

        yield put({ type: PROCESS_SUCCESS, colours: dominantColours, currentIndex: calculateCurrentIndex(monsterState.currentIndex, dominantColours), url: url });
        yield put(setMonstersDominantColours());
    } catch (error) {
        yield put({ type: PROCESS_FAILURE, error: 'something went wrong processing monster colours'});
    }
}

// Helper utilities
export const getDominantColours = (url) => {
    return Vibrant.from(url).getPalette()
        .then(response => {
            return Object.values(response)
                .filter( value => {
                return value !== null;
                    }).map (value =>  {
                        return {
                            r: Math.ceil(value._rgb[0]),
                            g: Math.ceil(value._rgb[1]),
                            b: Math.ceil(value._rgb[2])
                        }
            });
        })
};

export const calculateCurrentIndex = (currentIndex, colours) => {
    const colourCount = colours.length;
    console.log('colour count:' + colourCount);
    console.log('colours:' + colours);
    return (currentIndex < colours.length-1 ? currentIndex +1 : 0);
};