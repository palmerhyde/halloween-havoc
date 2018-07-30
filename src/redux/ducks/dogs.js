import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios/index";

// Actions
export const GET = 'API_CALL_REQUEST';
export const SUCCESS = 'API_CALL_SUCCESS';
export const FAILURE = 'API_CALL_FAILURE';

// reducer
const initialState = {
    fetching: false,
    dog: null,
    error: null,
};

export default function dogReducer(state = initialState, action) {
    switch (action.type) {
        case GET:
            return { ...state, fetching: true, error: null };
        case SUCCESS:
            return { ...state, fetching: false, dog: action.dog };
        case FAILURE:
            return { ...state, fetching: false, dog: null, error: action.error };
        default:
            return state;
    }
}

// Action creators
export function getDog() {
    return {
        type: GET,
    };
}

export function* watcherDogSaga() {
    yield takeLatest(GET, workerDogSaga);
}

function* workerDogSaga() {
    try {
        const response = yield call(fetchDog);
        console.log('response:' + JSON.stringify(response));
        const dog = response.data.message;

        yield put({ type: SUCCESS, dog });

    } catch (error) {
        yield put({ type: FAILURE, error });
    }
}

// Services
function fetchDog() {
    return axios({
        method: "get",
        url: "https://dog.ceo/api/breeds/image/random"
    });
}