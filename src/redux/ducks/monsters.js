import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

// Actions
const GET = 'MONSTER_API_GET_REQUEST';
const GET_SUCCESS = 'MONSTER_API_GET_REQUEST_SUCCESS';
const GET_FAILURE = 'MONSTER_API_GET_REQUEST_FAILURE';

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

// Selectors

// Sagas
export function* watcherMonsterSaga() {
    yield takeLatest(GET, workerMonsterSaga);
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

// Services
function fetchMonsters() {
    return axios({
        method: "get",
        url: "http://localhost:3004/monsters"
    });
}